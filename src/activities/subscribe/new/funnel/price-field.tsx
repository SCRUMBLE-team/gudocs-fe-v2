import LineTextField from "../../../../components/line-field/line-text-field";
import { useSubscribeContext } from "../subscribe-context";

/** 999,999,999원 */
const MAX_DIGITS = 9;

function PriceField() {
  const { price, onChangePrice } = useSubscribeContext("PriceField");

  return (
    <LineTextField
      label="이용요금"
      suffix="원"
      inputMode="numeric"
      value={price == null ? "" : price.toLocaleString("ko-KR")}
      onChange={(value) => {
        const digits = value.replace(/[^0-9]/g, "").slice(0, MAX_DIGITS);
        onChangePrice(digits === "" ? null : Number(digits));
      }}
    />
  );
}

export default PriceField;
