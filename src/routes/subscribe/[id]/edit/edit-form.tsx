import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import BillingCycleField from "../../new/funnel/billing-cycle-field";
import BillingDateField from "../../new/funnel/billing-date-field";
import { useSubscriptionQuery } from "../../../../hooks/query/useSubscriptionQuery";
import { useEditSubscriptionMutation } from "../../../../hooks/query/useEditSubscriptionMutation";
import { fromISODate } from "../../../../utils/date";

function EditForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const showToast = useToast();
  const { data } = useSubscriptionQuery(id);
  const { mutate, isPending } = useEditSubscriptionMutation();

  // 기존 값으로 시드. 퍼널 필드들은 SubscribeContext에 바인딩돼 있어 그대로 재사용한다.
  // ServiceField 옵션은 서비스 '이름'을 value로 쓰므로 serviceName을 그대로 시드하면
  // SheetSelectField가 옵션과 매칭돼 기본값이 채워진다.
  const [category, setCategory] = useState(data.category);
  const [service, setService] = useState<string | null>(data.serviceName);
  const [billingCycle, setBillingCycle] = useState(data.billingCycle);
  const [price, setPrice] = useState<number | null>(data.price);
  const [paymentDate, setPaymentDate] = useState<Date | null>(
    fromISODate(data.firstBillingDate),
  );

  const contextValue: SubscribeContextValue = {
    category,
    onChangeCategory: setCategory,
    service,
    onChangeService: setService,
    billingCycle,
    onChangeBillingCycle: setBillingCycle,
    price,
    onChangePrice: setPrice,
    paymentDate,
    onChangePaymentDate: setPaymentDate,
    onChangeStep: () => {},
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
          navigate(`/subscribe/${id}`);
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
