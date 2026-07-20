import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import {
  type BillingCycle,
  type SubscribeCategory,
} from "../../../types/subscribe";
import SelectService from "./funnel/select-service";
import { SubscribeContext, type SubscribeStep } from "./subscribe-context";
import SelectPay from "./funnel/select-pay";

function SubscribeNewPage() {
  const [category, setCategory] = useState<SubscribeCategory | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);

  const [step, setStep] = useState<SubscribeStep>("select_service");

  const navigate = useNavigate();
  const location = useLocation();

  function handleBack() {
    // 퍼널 안에서는 페이지가 아니라 스텝을 되돌린다.
    if (step === "select_pay") {
      setStep("select_service");
      return;
    }

    if (location.key === "default") {
      navigate("/", { replace: true });
      return;
    }

    navigate(-1);
  }

  return (
    <SubscribeContext.Provider
      value={{
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
        onChangeStep: setStep,
      }}
    >
      <VStack className="flex-1" isScrollable>
        <HStack paddingInline={2} paddingBlock={2} align="center">
          <IconButton
            label="뒤로 가기"
            icon={<Icon icon="chevronLeft" />}
            variant="ghost"
            onClick={handleBack}
          />
        </HStack>

        {step === "select_service" && <SelectService />}
        {step === "select_pay" && <SelectPay />}
      </VStack>
    </SubscribeContext.Provider>
  );
}

export default SubscribeNewPage;
