import { useNavigate } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading } from "@astryxdesign/core/Heading";
import { useToast } from "@astryxdesign/core/Toast";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
import { useCreateSubscriptionMutation } from "../../../../hooks/query/useCreateSubscriptionMutation";
import { useSubscribeContext } from "../subscribe-context";
import { toSubscribePayload } from "../to-subscribe-payload";
import BillingCycleField from "./billing-cycle-field";
import PriceField from "./price-field";
import BillingDateField from "./billing-date-field";

function SelectPay() {
  const context = useSubscribeContext("SelectPay");
  const { service, price, billingCycle, paymentDate } = context;
  const navigate = useNavigate();
  const showToast = useToast();
  const { mutate, isPending } = useCreateSubscriptionMutation();

  const title = (() => {
    if (!price) return `${service} 이용요금을\n알려주세요`;
    if (!billingCycle) return "결제 주기를\n알려주세요";
    if (!paymentDate) return "최근 결제일을\n알려주세요";
    return "이대로 등록할까요?";
  })();

  const payload = toSubscribePayload(context);

  function handleSubmit() {
    if (payload == null || isPending) {
      return;
    }

    mutate(payload, {
      onSuccess: () => {
        showToast({ body: "구독이 등록되었어요" });
        navigate("/");
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
  );
}

export default SelectPay;
