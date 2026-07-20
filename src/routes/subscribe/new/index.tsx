import { TopNavigation, TopNavigationBackButton } from "@toss/tds-mobile";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    <div>
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
        <TopNavigation
          leading={
            <TopNavigationBackButton
              aria-label="뒤로 가기"
              onClick={handleBack}
            />
          }
        />
        {(() => {
          switch (step) {
            case "select_service":
              return <SelectService />;
            case "select_pay":
              return <SelectPay />;

            default:
              return <></>;
          }
        })()}
      </SubscribeContext.Provider>
    </div>
  );
}

export default SubscribeNewPage;
