import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { ResponsiveContainer, BarChart, Bar, XAxis, LabelList } from "recharts";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { getBaseYearMonth } from "../../utils/date";
import { formatWon } from "../../utils/format";

// 전월 대비 문구. 덜 썼으면 금액을 파란색(accent), 더 썼으면 빨간색(text-red) 토큰으로 강조한다.
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

function SpendingSummary() {
  const baseParams = getBaseYearMonth();
  const { data: monthly } = useMonthlyExpenseQuery(baseParams);
  const { data: trends } = useExpensesTrendsQuery(baseParams);

  // 색은 gudocs 테마 토큰(CSS 변수)을 각 항목의 fill로 넘긴다.
  // 현재 달만 accent 원색, 나머지는 accent-muted로 대비를 준다.
  const chartData = trends.monthlyTrends.map(({ year, month, totalAmount }) => {
    const isCurrent = year === baseParams.year && month === baseParams.month;
    return {
      label: `${month}월`,
      amount: totalAmount,
      fill: isCurrent ? "var(--color-accent)" : "var(--color-accent-muted)",
    };
  });

  return (
    <Card className="border-gray-300">
      <VStack gap={3}>
        <VStack gap={0.5}>
          <Text type="large" weight="bold">
            이번달 구독료 확인
          </Text>
          <ChangeText changeAmount={monthly.changeAmount} />
        </VStack>

        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 20 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="amount"
                position="top"
                formatter={(value) => formatWon(Number(value))}
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  fill: "var(--color-text-secondary)",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <Button
          label="지출 금액 자세히 보러가기"
          variant="primary"
          className="p-6"
        />
      </VStack>
    </Card>
  );
}

export default SpendingSummary;
