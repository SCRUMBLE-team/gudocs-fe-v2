import { FixedBottomCTA, ListHeader } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import { useNavigate } from "react-router-dom";
import { useSubscribeContext } from "../subscribe-context";
import { toSubscribePayload } from "../to-subscribe-payload";
import BillingCycleField from "./billing-cycle-field";
import PriceField from "./price-field";
import BillingDateField from "./billing-date-field";

function SelectPay() {
  const context = useSubscribeContext("SelectPay");
  const { service, price, billingCycle, paymentDate } = context;
  const navigate = useNavigate();

  const title = (() => {
    if (!price) return `${service} 이용요금을\n알려주세요`;
    if (!billingCycle) return "결제 주기를\n알려주세요";
    if (!paymentDate) return "최근 결제일을\n알려주세요";
    return "이대로 등록할까요?";
  })();

  const payload = toSubscribePayload(context);

  function handleSubmit() {
    if (payload == null) {
      return;
    }

    // TODO: 구독 등록 API가 생기면 연동한다.
    console.log(payload);
    navigate("/");
  }

  return (
    <>
      <ListHeader
        className="mb-3"
        size="large"
        title={
          <ListHeader.TitleParagraph color={colors.grey800} fontWeight="bold">
            {title}
          </ListHeader.TitleParagraph>
        }
      />
      <PriceField />
      <BillingCycleField />
      <BillingDateField />
      {payload && (
        <FixedBottomCTA
          takeSpace={true}
          showAfterDelay={{ animation: "slide", delay: 0 }}
          onTap={handleSubmit}
        >
          등록하기
        </FixedBottomCTA>
      )}
    </>
  );
}

export default SelectPay;
