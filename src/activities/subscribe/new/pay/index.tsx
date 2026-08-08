import { Suspense, useState } from "react";
import type { StaticActivityComponentType } from "@stackflow/react";
import { useGoBack } from "../../../../hooks/useGoBack";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useToast } from "@astryxdesign/core/Toast";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
import ServiceLogo from "../../../../components/service-logo";
import { useCatalogQuery } from "../../../../hooks/query/useCatalogQuery";
import { useCreateSubscriptionMutation } from "../../../../hooks/query/useCreateSubscriptionMutation";
import type { SubscribeCategory } from "../../../../types/subscribe";
import {
  SubscribeContext,
  type SubscribeContextValue,
} from "../subscribe-context";
import { toSubscribePayload } from "../to-subscribe-payload";
import { useFunnelFlow } from "../use-funnel-flow";
import PlanField from "../funnel/plan-field";
import PriceField from "../funnel/price-field";
import BillingCycleField from "../funnel/billing-cycle-field";
import BillingDateField from "../funnel/billing-date-field";

type PayFormProps = {
  category: SubscribeCategory;
  service: string;
  serviceCode: string | null;
};

/**
 * 카탈로그가 아는 기본 요금제.
 *
 * 서비스를 고르면 첫 번째 요금제를 쓴다. 대부분의 사용자는 대표 요금제를 쓰고
 * 있어서, 비워두고 묻는 것보다 채워두고 고치게 하는 편이 손이 덜 간다. 다른
 * 요금제는 이 화면의 요금제 필드에서 바꿀 수 있다.
 */
function PayForm({ category, service, serviceCode }: PayFormProps) {
  const { data: catalog } = useCatalogQuery();

  const plans = serviceCode
    ? (catalog.services.find((item) => item.code === serviceCode)?.plans ?? [])
    : [];
  // 최초 렌더 한 번만 계산한다. 이후에는 사용자가 고친 값이 진실이다.
  const [seed] = useState(() => plans[0]);

  const [billingCycle, setBillingCycle] = useState(seed?.billingCycle ?? null);
  const [price, setPrice] = useState<number | null>(seed?.price ?? null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);

  const showToast = useToast();
  const { closeFunnel } = useFunnelFlow();
  const { mutate, isPending } = useCreateSubscriptionMutation();

  const contextValue: SubscribeContextValue = {
    category,
    onChangeCategory: () => {},
    service,
    // 앞 화면에서 고른 code를 그대로 받는다. 이름으로 되찾으면 표시명이 겹치거나
    // 바뀌었을 때 엉뚱한 서비스의 code가 실린다.
    serviceCode,
    onChangeService: () => {},
    billingCycle,
    onChangeBillingCycle: setBillingCycle,
    price,
    onChangePrice: setPrice,
    paymentDate,
    onChangePaymentDate: setPaymentDate,
  };

  const payload = toSubscribePayload(contextValue);

  const title = (() => {
    if (!price) return "이용요금을\n알려주세요";
    if (!billingCycle) return "결제 주기를\n알려주세요";
    if (!paymentDate) return "최근 결제일을\n알려주세요";
    return "이대로 등록할까요?";
  })();

  function handleSubmit() {
    if (payload == null || isPending) {
      return;
    }

    mutate(payload, {
      onSuccess: () => {
        showToast({ body: "구독이 등록되었어요" });
        // 퍼널을 통째로 닫는다. pop() 하나면 앞 화면이 잠깐 비쳤다 사라진다.
        closeFunnel();
      },
      onError: () => {
        showToast({
          body: "등록에 실패했어요. 잠시 후 다시 시도해주세요.",
          type: "error",
          isAutoHide: true,
          autoHideDuration: 3000,
        });
      },
    });
  }

  return (
    <SubscribeContext.Provider value={contextValue}>
      <VStack className="flex-1">
        <VStack paddingInline={4} paddingBlock={2} gap={5}>
          <Heading level={2} className="whitespace-pre-line">
            {title}
          </Heading>

          {/* 앞 화면에서 고른 서비스를 로고와 함께 다시 보여준다. 제목이
              단계마다 바뀌는 화면이라, 지금 무엇을 등록하는 중인지 짚어줄
              고정된 자리가 없으면 중간에 맥락을 놓친다. */}
          <HStack gap={2} align="center">
            <ServiceLogo name={service} code={serviceCode} size={32} />
            <Text type="large" weight="semibold">
              {service}
            </Text>
          </HStack>

          <VStack gap={2}>
            <PlanField />
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
    </SubscribeContext.Provider>
  );
}

/**
 * 구독 등록 퍼널 마지막 단계 — 금액·결제 주기·결제일을 확인하고 등록한다.
 *
 * 앞 화면에서 고른 서비스는 파라미터로 받는다. 그래서 이 화면만 새로고침해도
 * 살아남는다. 카탈로그에 요금제가 있는 서비스라면 금액과 결제 주기는 이미
 * 채워져 있고, 사용자가 할 일은 훑어보고 틀린 것만 고치는 것뿐이다.
 */
const SubscribeNewPayActivity: StaticActivityComponentType<
  "SubscribeNewPay"
> = ({ params }) => {
  const goBack = useGoBack();

  return (
    <AppScreen>
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
          <PayForm
            category={params.category}
            service={params.service}
            serviceCode={params.serviceCode ?? null}
          />
        </Suspense>
      </VStack>
    </AppScreen>
  );
};

export default SubscribeNewPayActivity;
