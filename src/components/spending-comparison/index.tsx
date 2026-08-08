import { Text } from "@astryxdesign/core/Text";
import { formatWon } from "../../utils/format";

type ComparedMonth = { label: string; amount: number };

/**
 * 두 달의 구독료 차이 문구.
 *
 * 홈에서는 이번 달을 지난달·선택한 달과 비교하고, 지출 상세에서는 선택한 달을
 * 실제 이번 달과 비교한다. 비교 기준의 라벨과 금액을 함께 받아 두 방향을 지원한다.
 * 어느 화면이든 덜 쓴 금액은 accent, 더 쓴 금액은 red 토큰으로 표시한다.
 *
 * 라벨은 "지난달"이거나 "5월"처럼 항상 받침으로 끝나서 조사는 "과"로 고정된다.
 */
function SpendingComparison({
  amount,
  compared,
}: {
  /** 화면에서 설명할 달의 지출 금액. */
  amount: number;
  /** 비교 기준이 되는 달. 비교할 내역이 없으면 null. */
  compared: ComparedMonth | null;
}) {
  if (!compared) {
    return <Text type="body">비교할 이전 내역이 없어요</Text>;
  }

  const difference = amount - compared.amount;

  if (difference === 0) {
    return <Text type="body">{compared.label}과 동일하게 쓰고 있어요</Text>;
  }

  return (
    <Text type="body">
      {compared.label}보다{" "}
      <Text
        type="body"
        weight="bold"
        color={difference > 0 ? "inherit" : "accent"}
        className={
          difference > 0
            ? "text-[var(--color-text-red)]"
            : undefined
        }
      >
        {formatWon(Math.abs(difference))}
      </Text>{" "}
      {difference > 0 ? "더" : "덜"} 쓰고 있어요
    </Text>
  );
}

export default SpendingComparison;
