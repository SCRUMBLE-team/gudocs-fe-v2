import { useState } from "react";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { useFlow } from "@stackflow/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Rectangle,
} from "recharts";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { getBaseYearMonth } from "../../utils/date";
import { formatWon } from "../../utils/format";
import SpendingComparison from "../../components/spending-comparison";
import CardEmptyMessage from "./card-empty-message";
import barchartLottie from "../../assets/lottie/bar_chart.json";

type MonthDatum = {
  /** "2026-5" — 연·월이 같이 있어야 해가 바뀌어도 안 겹친다 */
  key: string;
  label: string;
  amount: number;
  isCurrent: boolean;
};

/**
 * 막대 하나.
 *
 * x·y·width·height·payload는 recharts가 shape에 주입하므로 전부 optional이다.
 * 커스텀 shape을 쓰는 이유는 두 가지다.
 *   1) 막대마다 aria-label·role을 붙여야 하는데 기본 rect에는 넣을 수 없다.
 *   2) 선택 상태(테두리·명도)를 payload를 보고 직접 그려야 한다.
 * 모서리 라운드는 recharts의 Rectangle에 맡겨 기존 radius 표현을 유지한다.
 */
function MonthBar({
  payload,
  selectedKey,
  hoveredKey,
  onSelect,
  onHover,
  ...rest
}: {
  payload?: MonthDatum;
  selectedKey: string | null;
  hoveredKey: string | null;
  onSelect: (month: MonthDatum) => void;
  onHover: (key: string | null) => void;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) {
  // 키보드로 옮겨 다닐 때 어느 막대에 있는지 보여야 한다. SVG라 outline이
  // 브라우저마다 제각각으로 그려져서, 선택 상태와 같은 테두리로 직접 표시한다.
  // 훅은 조기 반환보다 앞에 있어야 렌더마다 호출 순서가 같다.
  const [isFocused, setIsFocused] = useState(false);

  if (!payload) return null;

  const isSelected = selectedKey === payload.key;
  const isHovered = hoveredKey === payload.key;

  // 이번 달은 언제나 진한 accent, 나머지는 연한 accent.
  const fill = payload.isCurrent
    ? "var(--color-accent)"
    : "var(--color-accent-muted)";

  // 선택·호버는 명도로 구분한다. 이번 달 막대는 이미 원색이라 더 밝힐 게 없어
  // 불투명도만 1로 두고 테두리로만 상태를 알린다.
  const fillOpacity = isSelected || isHovered || isFocused ? 1 : 0.75;
  const hasOutline = isSelected || isFocused;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${payload.label} 구독료 ${formatWon(payload.amount)}`}
      aria-pressed={isSelected}
      className="cursor-pointer focus:outline-none"
      onClick={() => onSelect(payload)}
      onMouseEnter={() => onHover(payload.key)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onSelect(payload);
      }}
    >
      <Rectangle
        {...rest}
        radius={[6, 6, 0, 0]}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={hasOutline ? "var(--color-accent)" : "none"}
        strokeWidth={hasOutline ? 2 : 0}
      />
    </g>
  );
}

function SpendingSummary() {
  const { push } = useFlow();
  const baseParams = getBaseYearMonth();
  const { data: monthly } = useMonthlyExpenseQuery(baseParams);
  const { data: trends } = useExpensesTrendsQuery(baseParams);

  // 고른 달은 화면 상태로만 들고 있는다. null이면 "지난달과 비교"인 기본 상태다.
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  // 호버는 미리보기라 선택을 덮어쓰기만 하고 저장하지는 않는다(데스크톱 전용).
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // 어느 달에도 지출이 없으면 0짜리 막대만 늘어서므로 차트를 그리지 않는다.
  const hasSpending = trends.monthlyTrends.some(
    ({ totalAmount }) => totalAmount > 0,
  );

  const months: MonthDatum[] = trends.monthlyTrends.map(
    ({ year, month, totalAmount }) => ({
      key: `${year}-${month}`,
      label: `${month}월`,
      amount: totalAmount,
      isCurrent: year === baseParams.year && month === baseParams.month,
    }),
  );

  // 막대 높이의 기준. 0으로 나누는 걸 막으려고 최소 1을 둔다.
  const maxAmount = Math.max(...months.map((m) => m.amount), 1);

  const currentIndex = months.findIndex((m) => m.isCurrent);
  const previousMonth = currentIndex > 0 ? months[currentIndex - 1] : null;

  // 호버가 선택보다 우선한다. 이번 달 막대는 비교 대상이 될 수 없으므로
  // (자기 자신과의 비교라) 기본 상태인 지난달로 되돌린다.
  const activeKey = hoveredKey ?? selectedKey;
  const activeMonth = months.find((m) => m.key === activeKey) ?? null;
  const comparedMonth =
    activeMonth && !activeMonth.isCurrent ? activeMonth : previousMonth;

  // 명시적으로 고른 달은 "5월보다", 기본 상태는 "지난달보다"로 부른다.
  const comparedLabel =
    activeMonth && !activeMonth.isCurrent ? activeMonth.label : "지난달";

  const handleSelect = (month: MonthDatum) => {
    // 이번 달을 누르면 기본 상태로 돌아간다.
    setSelectedKey(month.isCurrent ? null : month.key);
  };

  return (
    <Card className="border-gray-300">
      <VStack gap={3}>
        <VStack gap={0.5}>
          <Text type="large" weight="bold">
            이번 달 구독료
          </Text>
          {hasSpending && (
            <>
              {/*
                다른 달을 골라도 이 금액은 언제나 이번 달 총액으로 고정한다.

                크기는 size prop이 아니라 Tailwind 유틸리티로 준다. Text는
                themeProps가 붙인 data-type 속성 선택자로 font-size를 잡는데,
                그게 size prop이 만드는 클래스보다 우선해서 display 계열에서는
                size가 먹지 않는다. utilities 레이어가 맨 뒤라(index.css) 유틸리티는
                확실히 이긴다 — 헤더 로고(activities/layout.tsx)도 같은 방식이다.
                text-2xl = 31px로 제목(type="large", 19px)보다 확실히 크다.
              */}
              <Text className="text-2xl" weight="bold">
                {formatWon(monthly.totalAmount)}
              </Text>
              <SpendingComparison
                amount={monthly.totalAmount}
                compared={
                  comparedMonth
                    ? { label: comparedLabel, amount: comparedMonth.amount }
                    : null
                }
              />
            </>
          )}
        </VStack>

        {hasSpending ? (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={months}
                margin={{ top: 8 }}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                />
                {/*
                  축을 그리진 않지만 도메인은 직접 넘겨야 한다. 맡겨두면
                  recharts가 실제 최대값보다 훨씬 큰 범위를 잡아 막대가 몇 px로
                  뭉개진다("dataMax"로도 부족했다).
                */}
                <YAxis hide domain={[0, maxAmount]} />
                <Bar
                  dataKey="amount"
                  shape={
                    <MonthBar
                      selectedKey={selectedKey}
                      hoveredKey={hoveredKey}
                      onSelect={handleSelect}
                      onHover={setHoveredKey}
                    />
                  }
                />
              </BarChart>
            </ResponsiveContainer>

            <Button
              label="지출 금액 자세히 보러가기"
              variant="primary"
              className="p-6"
              onClick={() => push("Expenses", {})}
            />
          </>
        ) : (
          <CardEmptyMessage
            animationData={barchartLottie}
            message={"구독을 등록하면\n월별 지출 추이를 보여드려요"}
          />
        )}
      </VStack>
    </Card>
  );
}

export default SpendingSummary;
