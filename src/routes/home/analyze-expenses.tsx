import { Button, Card, VStack, HStack, Text } from "@astryxdesign/core";
import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";
import { CATEGORY_META } from "../../constants/category";
import { useCategoryExpensesQuery } from "../../hooks/query/useCategoryExpensesQuery";
import { getBaseYearMonth } from "../../utils/date";
import { formatWon } from "../../utils/format";

// 카테고리 별 소비 분석 — 지출 비중을 Recharts 도넛 차트로 보여준다.

// 카테고리 팔레트. 테마의 쨍한 아이콘 원색 대신, 조화롭고 CVD/대비 검증을 통과한
// 카테고리 색을 쓴다. light-dark()로 라이트/다크 모드의 각 스텝을 자동 선택한다.
// (adjacent CVD ΔE 9.1 light / 8.4 dark, normal-vision 19.6 / 19.3 통과)
const PIE_PALETTE = [
  "light-dark(#2a78d6, #3987e5)", // blue
  "light-dark(#eb6834, #d95926)", // orange
  "light-dark(#1baf7a, #199e70)", // aqua
  "light-dark(#eda100, #c98500)", // yellow
  "light-dark(#e87ba4, #d55181)", // magenta
  "light-dark(#008300, #008300)", // green
];

const TOP_COUNT = 5;

type Slice = {
  key: string;
  name: string;
  emoji: string;
  amount: number;
  fill: string;
};

function AnalyzeExpenses() {
  const { data } = useCategoryExpensesQuery(getBaseYearMonth());

  // 금액 내림차순 정렬 후 상위 N개 + 나머지는 "기타"로 합산해 조각이 잘게 쪼개지지 않게 한다.
  const sorted = [...data.categories].sort((a, b) => b.amount - a.amount);
  const top = sorted.slice(0, TOP_COUNT);
  const rest = sorted.slice(TOP_COUNT);

  const rawSlices: Omit<Slice, "fill">[] = top.map((c) => ({
    key: c.category,
    name: c.categoryName,
    emoji: CATEGORY_META[c.category]?.emoji ?? "",
    amount: c.amount,
  }));

  if (rest.length > 0) {
    rawSlices.push({
      key: "ETC_REST",
      name: "기타",
      emoji: CATEGORY_META.ETC.emoji,
      amount: rest.reduce((sum, c) => sum + c.amount, 0),
    });
  }

  // 팔레트 색을 각 조각의 fill로 넣어 Pie와 범례가 같은 색을 공유하게 한다.
  const slices: Slice[] = rawSlices.map((s, i) => ({
    ...s,
    fill: PIE_PALETTE[i % PIE_PALETTE.length],
  }));

  const toPercent = (amount: number) =>
    data.totalAmount ? Math.round((amount / data.totalAmount) * 100) : 0;

  return (
    <Card className="border-gray-300">
      <VStack gap={3}>
        <VStack gap={0.5}>
          <Text type="large" weight="bold">
            나의 구독 소비 분석
          </Text>
          <Text type="supporting">이번달 총 {formatWon(data.totalAmount)}</Text>
        </VStack>

        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={slices}
              dataKey="amount"
              nameKey="name"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            />
            <Tooltip
              formatter={(value, name) => [formatWon(Number(value)), name]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 커스텀 범례: 팔레트 색 점 + emoji/label + 금액·퍼센트 */}
        <VStack gap={2}>
          {slices.map((slice) => (
            <HStack key={slice.key} justify="between" align="center">
              <HStack gap={1.5} align="center">
                <VStack
                  className="shrink-0"
                  width={10}
                  height={10}
                  style={{ backgroundColor: slice.fill }}
                />
                <Text type="body" weight="semibold">
                  {slice.emoji} {slice.name}
                </Text>
              </HStack>
              <Text type="supporting" weight="semibold">
                {formatWon(slice.amount)} · {toPercent(slice.amount)}%
              </Text>
            </HStack>
          ))}
        </VStack>

        <Button label="소비 분석 살펴보기" variant="primary" className="p-6" />
      </VStack>
    </Card>
  );
}

export default AnalyzeExpenses;
