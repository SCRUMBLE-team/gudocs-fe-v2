import { Suspense, useState } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useToast } from "@astryxdesign/core/Toast";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
import LineTextField from "../../../../components/line-field/line-text-field";
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

/**
 * OCR 결과 확인·수정 화면.
 *
 * 퍼널처럼 나눠 묻지 않고 인식한 필드를 한 번에 띄운다. 카탈로그 서비스 매칭에
 * 실패한 경우에는 직접 입력과 동일하게 서비스명만 묻고 카테고리는 내부 값으로
 * 유지한다. 유효성 판단(toSubscribePayload)은 직접 입력·수정 화면과 공유한다.
 */
const SubscribeNewConfirmActivity: StaticActivityComponentType<
  "SubscribeNewConfirm"
> = ({ params }) => {
  // 파라미터는 URL을 거치며 문자열이 되고 OCR 값도 신뢰할 수 없다.
  // 초기값 계산은 최초 렌더 한 번이면 충분하므로 lazy initializer로 감싼다.
  const [draft] = useState(() => toSubscribeDraft(params));

  // 서비스 매칭에 실패하면 직접 입력과 같은 규칙으로 기타에 분류한다. OCR이
  // 카테고리까지 알아냈다면 그 값은 화면에 다시 묻지 않고 그대로 유지한다.
  const [category, setCategory] = useState(() => draft.category ?? "ETC");
  const [service, setService] = useState(draft.service);
  const [serviceCode, setServiceCode] = useState(draft.serviceCode);
  const [billingCycle, setBillingCycle] = useState(draft.billingCycle);
  const [price, setPrice] = useState(draft.price);
  const [paymentDate, setPaymentDate] = useState(draft.paymentDate);
  const isCustomService = serviceCode == null;

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

  const payload = toSubscribePayload(contextValue);

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

                <VStack gap={2}>
                  {isCustomService ? (
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
