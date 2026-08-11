import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import LineTextField from "../../../../components/line-field/line-text-field";
import { formatWon } from "../../../../utils/format";
import { useSubscribeContext } from "../subscribe-context";
import { splitPrice } from "../to-subscribe-payload";

/** 나눠봐야 의미 있는 최대치. 두 자리면 충분하다. */
const MAX_SHARE = 99;

/**
 * 가족 요금제처럼 여러 명이 나눠 내는 구독의 인원 입력.
 *
 * 인원은 서버에 저장되지 않는다. 등록 시점에 총액을 나눠 내 몫만 price로 보내고,
 * 그 결과 홈·지출·분석의 합계가 손대지 않아도 실제 지출과 맞는다. 대신 저장되는
 * 금액이 입력한 금액과 달라지므로, 무엇이 저장되는지 아래 안내로 못박는다.
 *
 * 비어 있는 상태(0)가 기본이다. 대부분은 혼자 내므로 미리 채워두지 않는다.
 * 0은 splitPrice에서 1과 같게 취급돼 금액을 나누지 않는다.
 */
function ShareCountField() {
  const { price, shareCount, onChangeShareCount } =
    useSubscribeContext("ShareCountField");

  const myShare = price == null ? null : splitPrice(price, shareCount);

  return (
    <VStack gap={1}>
      <LineTextField
        label="나눠 내는 인원"
        placeholder="혼자 낸다면 비워두세요"
        suffix="명"
        inputMode="numeric"
        // 0은 "안 정함"이라 "0명"으로 보이면 안 된다. 빈 칸으로 낸다.
        value={shareCount === 0 ? "" : String(shareCount)}
        onChange={(value) => {
          const digits = value.replace(/[^0-9]/g, "").slice(0, 2);
          const next = digits === "" ? 0 : Number(digits);
          onChangeShareCount(Math.min(next, MAX_SHARE));
        }}
      />
      {shareCount > 1 && price != null && myShare != null && (
        <Text type="supporting" color="secondary">
          {`총 ${formatWon(price)} ÷ ${shareCount}명 · 내가 내는 ${formatWon(myShare)}이 저장돼요`}
        </Text>
      )}
    </VStack>
  );
}

export default ShareCountField;
