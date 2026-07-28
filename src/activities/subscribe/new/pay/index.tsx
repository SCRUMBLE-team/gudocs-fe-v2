import { useState } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Heading } from "@astryxdesign/core/Heading";
import { useToast } from "@astryxdesign/core/Toast";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
import { useCreateSubscriptionMutation } from "../../../../hooks/query/useCreateSubscriptionMutation";
import type { BillingCycle } from "../../../../types/subscribe";
import {
  SubscribeContext,
  type SubscribeContextValue,
} from "../subscribe-context";
import { toSubscribePayload } from "../to-subscribe-payload";
import PriceField from "../funnel/price-field";
import BillingCycleField from "../funnel/billing-cycle-field";
import BillingDateField from "../funnel/billing-date-field";

/** 퍼널을 열 때 쌓인 화면 수. 등록을 마치면 이만큼 걷어내 띄운 탭으로 돌아간다. */
const FUNNEL_DEPTH = 2;

/**
 * 구독 등록 퍼널 2단계 — 금액·결제 주기·결제일을 채우고 등록한다.
 *
 * 1단계에서 고른 카테고리와 서비스는 파라미터로 받는다. 그래서 이 화면만 새로고침해도
 * 살아남는다. 나머지 값은 여기서 들고, 다섯 개를 합쳐 퍼널 필드들이 보는
 * SubscribeContext를 조립한다(수정 화면의 edit-form과 같은 모양).
 */
const SubscribeNewPayActivity: StaticActivityComponentType<
  "SubscribeNewPay"
> = ({ params }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);

  const { pop } = useFlow();
  const showToast = useToast();
  const { mutate, isPending } = useCreateSubscriptionMutation();

  const contextValue: SubscribeContextValue = {
    category: params.category,
    onChangeCategory: () => {},
    service: params.service,
    onChangeService: () => {},
    billingCycle,
    onChangeBillingCycle: setBillingCycle,
    price,
    onChangePrice: setPrice,
    paymentDate,
    onChangePaymentDate: setPaymentDate,
  };

  const title = (() => {
    if (!price) return `${params.service} 이용요금을\n알려주세요`;
    if (!billingCycle) return "결제 주기를\n알려주세요";
    if (!paymentDate) return "최근 결제일을\n알려주세요";
    return "이대로 등록할까요?";
  })();

  const payload = toSubscribePayload(contextValue);

  function handleSubmit() {
    if (payload == null || isPending) {
      return;
    }

    mutate(payload, {
      onSuccess: () => {
        showToast({ body: "구독이 등록되었어요" });
        // 1단계까지 함께 닫는다. pop() 하나면 1단계가 잠깐 비쳤다 사라진다.
        pop(FUNNEL_DEPTH);
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
    <AppScreen>
      <SubscribeContext.Provider value={contextValue}>
        <VStack minHeight="100%">
          <HStack paddingInline={2} paddingBlock={2} align="center">
            <IconButton
              label="뒤로 가기"
              icon={<Icon icon="chevronLeft" />}
              variant="ghost"
              onClick={() => pop()}
            />
          </HStack>

          <VStack className="flex-1">
            <VStack paddingInline={4} paddingBlock={2} gap={5}>
              <Heading level={2} className="whitespace-pre-line">
                {title}
              </Heading>

              <VStack gap={2}>
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
        </VStack>
      </SubscribeContext.Provider>
    </AppScreen>
  );
};

export default SubscribeNewPayActivity;
