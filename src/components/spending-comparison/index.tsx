import { Text } from "@astryxdesign/core/Text";
import { formatWon } from "../../utils/format";

type ComparedMonth = { label: string; amount: number };

/**
 * 두 달의 구독료 차이 문구.
 *
 * 홈에서는 이번 달을 지난달·선택한 달과 비교하고, 지출 상세에서는 선택한 달을
 * 실제 이번 달과 비교한다. 비교 기준의 라벨과 금액을 함께 받아 두 방향을 지원한다.
 *
 * 라벨은 "지난달"이거나 "5월"처럼 항상 받침으로 끝나서 조사는 "과"로 고정된다.
 */
function SpendingComparison({
  amount,
  compared,
  highlight = "accent",
}: {
  /** 화면에서 설명할 달의 지출 금액. */
  amount: number;
  /** 비교 기준이 되는 달. 비교할 내역이 없으면 null. */
  compared: ComparedMonth | null;
  /** 증가는 빨강, 감소는 파랑으로 구분해야 하는 상세 화면에서 directional을 쓴다. */
  highlight?: "accent" | "directional";
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
        color={
          highlight === "directional" && difference > 0
            ? "inherit"
            : "accent"
        }
        className={
          highlight === "directional" && difference > 0
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
