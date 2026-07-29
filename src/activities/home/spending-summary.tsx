import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/VStack";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { useFlow } from "@stackflow/react";
import { ResponsiveContainer, BarChart, Bar, XAxis, LabelList } from "recharts";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { getBaseYearMonth } from "../../utils/date";
import { formatWon } from "../../utils/format";
import ChangeText from "../../components/change-text";
import CardEmptyMessage from "./card-empty-message";
import barchartLottie from "../../assets/lottie/bar_chart.json";

function SpendingSummary() {
  const { push } = useFlow();
  const baseParams = getBaseYearMonth();
  const { data: monthly } = useMonthlyExpenseQuery(baseParams);
  const { data: trends } = useExpensesTrendsQuery(baseParams);

  // 어느 달에도 지출이 없으면 0짜리 막대만 늘어서므로 차트를 그리지 않는다.
  const hasSpending = trends.monthlyTrends.some(
    ({ totalAmount }) => totalAmount > 0,
  );

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
          {hasSpending && <ChangeText changeAmount={monthly.changeAmount} />}
        </VStack>

        {hasSpending ? (
          <>
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
