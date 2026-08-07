import { Text } from "@astryxdesign/core/Text";
import { formatWon } from "../../utils/format";

export type ComparedMonth = { label: string; amount: number };

/**
 * 이번 달과 비교 대상 달의 구독료 차이 문구.
 *
 * 홈 요약 카드와 지출 상세가 같이 쓴다. 어느 쪽이든 "이번 달"을 기준으로 두고
 * 고른 달과 견주므로, 비교 대상만 라벨로 받는다.
 *
 * 라벨은 "지난달"이거나 "5월"처럼 항상 받침으로 끝나서 조사는 "과"로 고정된다.
 */
function SpendingComparison({
  currentAmount,
  compared,
}: {
  currentAmount: number;
  /** 비교할 달. 이번 달이 스택의 첫 달이라 비교 대상이 없으면 null */
  compared: { label: string; amount: number } | null;
}) {
  if (!compared) {
    return <Text type="body">비교할 이전 내역이 없어요</Text>;
  }

  const difference = currentAmount - compared.amount;

  if (difference === 0) {
    return <Text type="body">{compared.label}과 동일하게 쓰고 있어요</Text>;
  }

  return (
    <Text type="body">
      {compared.label}보다{" "}
      <Text type="body" weight="bold" color="accent">
        {formatWon(Math.abs(difference))}
      </Text>{" "}
      {difference > 0 ? "더" : "덜"} 쓰고 있어요
    </Text>
  );
}

export default SpendingComparison;
