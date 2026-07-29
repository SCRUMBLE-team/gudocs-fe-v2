import { Text } from "@astryxdesign/core/Text";
import { formatWon } from "../../utils/format";

/**
 * 전월 대비 문구.
 *
 * 덜 썼으면 금액을 파란색(accent), 더 썼으면 빨간색(text-red) 토큰으로 강조한다.
 * 홈 요약 카드와 지출 상세 화면이 같은 문구를 쓴다.
 */
function ChangeText({ changeAmount }: { changeAmount: number }) {
  if (changeAmount === 0) {
    return <Text type="supporting">지난달과 동일하게 쓰는 중</Text>;
  }

  const spentLess = changeAmount < 0;
  const amountColor = spentLess
    ? "text-[var(--color-accent)]"
    : "text-[var(--color-text-red)]";

  return (
    <Text type="supporting">
      지난달 대비{" "}
      <Text
        type="supporting"
        weight="bold"
        color="inherit"
        className={amountColor}
      >
        {formatWon(Math.abs(changeAmount))}
      </Text>{" "}
      {spentLess ? "덜" : "더"} 쓰는 중
    </Text>
  );
}

export default ChangeText;
