import { Suspense, useDeferredValue, useState } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { List, ListItem } from "@astryxdesign/core/List";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Text } from "@astryxdesign/core/Text";
import { useToast } from "@astryxdesign/core/Toast";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
import LineTextField from "../../../../components/line-field/line-text-field";
import { PencilIcon } from "../../../../components/service-picker/category-icons";
import SearchField from "../../../../components/service-picker/search-field";
import { searchServices } from "../../../../components/service-picker/search-services";
import ServiceRow from "../../../../components/service-picker/service-row";
import type { ServiceSelection } from "../../../../components/service-picker/types";
import { useCatalogQuery } from "../../../../hooks/query/useCatalogQuery";
import { useCreateSubscriptionMutation } from "../../../../hooks/query/useCreateSubscriptionMutation";
import {
  SubscribeContext,
  type SubscribeContextValue,
} from "../subscribe-context";
import { toSubscribeDraft } from "../to-subscribe-draft";
import { toSubscribePayload } from "../to-subscribe-payload";
import CategoryField from "../funnel/category-field";
import ServiceField from "../funnel/service-field";
import PriceField from "../funnel/price-field";
import BillingCycleField from "../funnel/billing-cycle-field";
import BillingDateField from "../funnel/billing-date-field";

/** 퍼널을 열 때 쌓인 화면 수(선택 화면 + 이 화면). 등록을 마치면 이만큼 걷어낸다. */
const FUNNEL_DEPTH = 2;

type ServiceResolution = "search" | "catalog" | "custom";

type OcrServiceSearchProps = {
  initialQuery: string;
  onSelect: (selection: ServiceSelection) => void;
  onCustom: (name: string) => void;
};

/** OCR이 카탈로그 매칭에 실패했을 때 기존 서비스 검색을 먼저 제공한다. */
function OcrServiceSearch({
  initialQuery,
  onSelect,
  onCustom,
}: OcrServiceSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const { data: catalog } = useCatalogQuery();
  const keyword = query.trim();
  const results = searchServices(catalog.services, deferredQuery);

  return (
    <VStack gap={4}>
      <SearchField
        label="서비스 이름"
        placeholder="서비스 이름을 검색해보세요…"
        value={query}
        onChange={setQuery}
        autoFocus
      />

      {keyword !== "" ? (
        results.length > 0 ? (
          <VStack gap={2}>
            <Text type="body" weight="bold">
              검색 결과
            </Text>
            <List density="spacious" hasDividers>
              {results.map((result) => (
                <ServiceRow
                  key={result.id}
                  label={result.label}
                  selection={result.selection}
                  onSelect={onSelect}
                />
              ))}
            </List>
          </VStack>
        ) : (
          <VStack paddingBlock={4} align="center">
            <Text color="secondary">{`'${keyword}' 검색 결과가 없어요`}</Text>
          </VStack>
        )
      ) : null}

      <VStack gap={2}>
        <Text type="body" weight="bold">
          찾는 서비스가 없나요?
        </Text>
        <List density="spacious">
          <ListItem
            label="직접 입력하기"
            description="서비스 이름을 직접 적어 등록해요"
            startContent={<Icon icon={PencilIcon} size="lg" color="accent" />}
            endContent={<Icon icon="chevronRight" size="sm" />}
            onClick={() => onCustom(keyword)}
          />
        </List>
      </VStack>
    </VStack>
  );
}

/**
 * OCR 결과 확인·수정 화면.
 *
 * 퍼널처럼 나눠 묻지 않고 인식한 필드를 한 번에 띄운다. 카탈로그 서비스 매칭에
 * 실패한 경우에는 OCR이 추정한 이름으로 기존 검색을 먼저 제공한다. 검색에서
 * 서비스를 고르거나 직접 입력을 선택한 뒤에만 나머지 등록 폼으로 이어진다.
 */
const SubscribeNewConfirmActivity: StaticActivityComponentType<
  "SubscribeNewConfirm"
> = ({ params }) => {
  // 파라미터는 URL을 거치며 문자열이 되고 OCR 값도 신뢰할 수 없다.
  // 초기값 계산은 최초 렌더 한 번이면 충분하므로 lazy initializer로 감싼다.
  const [draft] = useState(() => toSubscribeDraft(params));

  // 카테고리는 OCR 문구에서 따로 읽는 값이 아니라 카탈로그 매칭 결과다.
  // 매칭 실패 시 직접 입력을 선택하기 전까지는 임시 기타 값으로만 보관한다.
  const [category, setCategory] = useState(() => draft.category ?? "ETC");
  const [service, setService] = useState(draft.service);
  const [serviceCode, setServiceCode] = useState(draft.serviceCode);
  const [billingCycle, setBillingCycle] = useState(draft.billingCycle);
  const [price, setPrice] = useState(draft.price);
  const [paymentDate, setPaymentDate] = useState(draft.paymentDate);
  const [serviceResolution, setServiceResolution] =
    useState<ServiceResolution>(() =>
      draft.serviceCode == null ? "search" : "catalog",
    );

  const { pop } = useFlow();
  const goBack = useGoBack();
  const showToast = useToast();
  const { mutate, isPending } = useCreateSubscriptionMutation();

  const contextValue: SubscribeContextValue = {
    category,
    onChangeCategory: setCategory,
    service,
    // OCR이 인식한 code를 그대로 쓴다. 사용자가 서비스를 바꾸면 고른 항목의
    // code로 교체한다 — 이름으로 되찾지 않는다.
    serviceCode,
    onChangeService: (value, code) => {
      setService(value);
      setServiceCode(code ?? null);
    },
    billingCycle,
    onChangeBillingCycle: setBillingCycle,
    price,
    onChangePrice: setPrice,
    paymentDate,
    onChangePaymentDate: setPaymentDate,
  };

  // 검색 결과를 고르거나 직접 입력을 명시하기 전에는 OCR 추정 이름만으로
  // 등록할 수 없게 막는다.
  const payload =
    serviceResolution === "search" ? null : toSubscribePayload(contextValue);

  function handleSelectService(selection: ServiceSelection) {
    setCategory(selection.category);
    setService(selection.name);
    setServiceCode(selection.code);
    setServiceResolution("catalog");
  }

  function handleCustomService(name: string) {
    setCategory("ETC");
    setService(name);
    setServiceCode(null);
    setServiceResolution("custom");
  }

  function handleSubmit() {
    if (payload == null || isPending) {
      return;
    }

    mutate(payload, {
      onSuccess: () => {
        showToast({ body: "구독이 등록되었어요" });
        // 선택 화면까지 함께 닫는다. pop() 하나면 그 화면이 잠깐 비쳤다 사라진다.
        pop(FUNNEL_DEPTH);
      },
      onError: () =>
        showToast({
          body: "등록에 실패했어요. 잠시 후 다시 시도해주세요.",
          type: "error",
          isAutoHide: true,
          autoHideDuration: 3000,
        }),
    });
  }

  return (
    <AppScreen>
      <SubscribeContext.Provider value={contextValue}>
        <VStack minHeight="100%">
          <HStack paddingInline={2} paddingBlock={2} align="center">
            <IconButton
              label="뒤로 가기"
              icon={<Icon icon="chevronLeft" />}
              variant="ghost"
              onClick={goBack}
            />
          </HStack>

          <Suspense
            fallback={
              <VStack align="center" paddingBlock={10}>
                <Spinner size="lg" />
              </VStack>
            }
          >
            <VStack className="flex-1">
              <VStack paddingInline={4} paddingBlock={2} gap={5}>
                <Heading level={2} className="whitespace-pre-line">
                  {payload
                    ? "이대로 등록할까요?"
                    : "인식하지 못한 항목을\n채워주세요"}
                </Heading>

                {serviceResolution === "search" ? (
                  <OcrServiceSearch
                    initialQuery={service ?? ""}
                    onSelect={handleSelectService}
                    onCustom={handleCustomService}
                  />
                ) : (
                  <VStack gap={2}>
                    {serviceResolution === "custom" ? (
                      <LineTextField
                        label="서비스"
                        placeholder="서비스명"
                        value={service ?? ""}
                        onChange={(value) => {
                          setService(value);
                          setServiceCode(null);
                        }}
                      />
                    ) : (
                      <>
                        <CategoryField />
                        <ServiceField />
                      </>
                    )}
                    <PriceField />
                    <BillingCycleField />
                    <BillingDateField />
                  </VStack>
                )}
              </VStack>

              {payload && (
                <FixedBottomCTA
                  label="등록하기"
                  onClick={handleSubmit}
                  isDisabled={isPending}
                />
              )}
            </VStack>
          </Suspense>
        </VStack>
      </SubscribeContext.Provider>
    </AppScreen>
  );
};

export default SubscribeNewConfirmActivity;
