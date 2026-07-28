import SheetSelectField from "../../../../components/line-field/sheet-select-field";
import { BILLING_CYCLE_META } from "../../../../constants/paymet";
import type { BillingCycle } from "../../../../types/subscribe";
import { useSubscribeContext } from "../subscribe-context";

const BILLING_CYCLE_OPTIONS = Object.entries(BILLING_CYCLE_META).map(
  ([value, meta]) => ({ value: value as BillingCycle, label: meta.label }),
);

function BillingCycleField() {
  const { price, billingCycle, onChangeBillingCycle } =
    useSubscribeContext("BillingCycleField");

  if (price == null) {
    return null;
  }

  return (
    <SheetSelectField
      label="결제 주기"
      placeholder="결제 주기"
      options={BILLING_CYCLE_OPTIONS}
      value={billingCycle}
      onChange={onChangeBillingCycle}
    />
  );
}

export default BillingCycleField;
