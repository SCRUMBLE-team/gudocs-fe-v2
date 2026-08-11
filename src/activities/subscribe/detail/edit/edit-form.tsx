import { useState } from "react";
import { useFlow } from "@stackflow/react";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading } from "@astryxdesign/core/Heading";
import { useToast } from "@astryxdesign/core/Toast";
import FixedBottomCTA from "../../../../components/fixed-bottom-cta";
import {
  SubscribeContext,
  type SubscribeContextValue,
} from "../../new/subscribe-context";
import { toSubscribePayload } from "../../new/to-subscribe-payload";
import CategoryField from "../../new/funnel/category-field";
import ServiceField from "../../new/funnel/service-field";
import PriceField from "../../new/funnel/price-field";
import ShareCountField from "../../new/funnel/share-count-field";
import BillingCycleField from "../../new/funnel/billing-cycle-field";
import BillingDateField from "../../new/funnel/billing-date-field";
import { useSubscriptionQuery } from "../../../../hooks/query/useSubscriptionQuery";
import { useEditSubscriptionMutation } from "../../../../hooks/query/useEditSubscriptionMutation";
import { fromISODate } from "../../../../utils/date";

function EditForm({ id }: { id: string }) {
  const { pop } = useFlow();
  const showToast = useToast();
  const { data } = useSubscriptionQuery(id);
  const { mutate, isPending } = useEditSubscriptionMutation();
  const [category, setCategory] = useState(data.category);
  const [service, setService] = useState<string | null>(data.serviceName);
  const [serviceCode, setServiceCode] = useState<string | null>(
    data.serviceCode,
  );
  const [billingCycle, setBillingCycle] = useState(data.billingCycle);
  const [price, setPrice] = useState<number | null>(data.price);
  // 저장된 price는 이미 나뉜 내 몫이다. 인원수는 서버에 남지 않으므로 빈 칸으로
  // 시작하고, 손대지 않으면 저장 시 그대로 유지된다.
  // 값을 넣으면 지금 보이는 금액을 다시 나눈다 — 안내 문구가 그 결과를 못박는다.
  const [shareCount, setShareCount] = useState(0);
  const [paymentDate, setPaymentDate] = useState<Date | null>(
    fromISODate(data.firstBillingDate),
  );

  const contextValue: SubscribeContextValue = {
    category,
    onChangeCategory: setCategory,
    service,
    serviceCode,
    onChangeService: (value, code) => {
      setService(value);
      setServiceCode(code ?? null);
    },
    billingCycle,
    onChangeBillingCycle: setBillingCycle,
    price,
    onChangePrice: setPrice,
    shareCount,
    onChangeShareCount: setShareCount,
    paymentDate,
    onChangePaymentDate: setPaymentDate,
  };

  const payload = toSubscribePayload(contextValue);

  function handleSubmit() {
    if (payload == null || isPending) {
      return;
    }

    mutate(
      { subscriptionId: id, data: payload },
      {
        onSuccess: () => {
          showToast({ body: "구독 정보를 수정했어요" });
          // 수정 화면은 상세 위에 쌓여 있다. 닫으면 바로 아래가 상세다.
          pop();
        },
        onError: () =>
          showToast({
            body: "수정에 실패했어요. 잠시 후 다시 시도해주세요.",
            type: "error",
            isAutoHide: true,
            autoHideDuration: 3000,
          }),
      },
    );
  }

  return (
    <SubscribeContext.Provider value={contextValue}>
      <VStack className="flex-1">
        <VStack paddingInline={4} paddingBlock={2} gap={5}>
          <Heading level={2}>구독 정보를 수정할까요?</Heading>

          <VStack gap={2}>
            <CategoryField />
            <ServiceField />
            <PriceField />
            <ShareCountField />
            <BillingCycleField />
            <BillingDateField />
          </VStack>
        </VStack>

        {payload && (
          <FixedBottomCTA
            label="저장하기"
            onClick={handleSubmit}
            isDisabled={isPending}
          />
        )}
      </VStack>
    </SubscribeContext.Provider>
  );
}

export default EditForm;
