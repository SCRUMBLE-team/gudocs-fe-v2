import WheelDatePicker from "../../../../components/wheel-date-picker";
import { useSubscribeContext } from "../subscribe-context";

function BillingDateField() {
  const { billingCycle, price, paymentDate, onChangePaymentDate } =
    useSubscribeContext("BillingDateField");

  if (!billingCycle || price == null) {
    return null;
  }

  return (
    <WheelDatePicker
      label="최근 결제일"
      title="최근 결제일"
      placeholder="최근 결제일"
      value={paymentDate ?? undefined}
      onChange={onChangePaymentDate}
    />
  );
}

export default BillingDateField;
