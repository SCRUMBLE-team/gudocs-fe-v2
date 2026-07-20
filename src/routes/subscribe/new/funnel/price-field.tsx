import { TextField } from "@toss/tds-mobile";
import { useSubscribeContext } from "../subscribe-context";

/** 999,999,999원 */
const MAX_DIGITS = 9;

function PriceField() {
  const { price, onChangePrice } = useSubscribeContext("PriceField");

  return (
    <TextField
      autoFocus
      variant="line"
      label="이용요금"
      labelOption="sustain"
      inputMode="numeric"
      suffix="원"
      // TDS가 표시할 때 콤마를 넣고, onChange 전에 다시 떼어준다.
      // 그래서 value/onChange 양쪽 모두 콤마 없는 숫자를 주고받는다.
      format={TextField.format.price}
      value={price ?? ""}
      onChange={(event) => {
        const digits = event.target.value
          .replace(/[^0-9]/g, "")
          .slice(0, MAX_DIGITS);
        onChangePrice(digits === "" ? null : Number(digits));
      }}
    />
  );
}

export default PriceField;
