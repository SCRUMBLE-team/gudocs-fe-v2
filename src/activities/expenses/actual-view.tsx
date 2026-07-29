import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { useMonthlyExpenseDetailsQueries } from "../../hooks/query/useMonthlyExpenseDetailsQueries";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { toDayOfMonth } from "../../utils/date";
import { isBilledIn, isCountable, recentTrend, sumMonth } from "../../utils/expenses";
import ExpensesView, { type ExpenseRow } from "./expenses-view";

type Props = {
  base: { year: number; month: number };
  selected: { year: number; month: number };
  onSelectMonth: (period: { year: number; month: number }) => void;
};

/**
 * 실제 청구 기준.
 *
 * 서버 totalAmount는 월 환산이라 쓸 수 없다. 추이 구간 각 달의 상세를 모두 받아
 * 연간 구독을 청구되는 달에만 전액으로 얹어 다시 계산한다.
 * (요청이 달 수만큼 나가므로 이 기준을 골랐을 때만 마운트된다.)
 */
function ActualView({ base, selected, onSelectMonth }: Props) {
  const { data: trends } = useExpensesTrendsQuery(base);
  const periods = recentTrend(trends.monthlyTrends);

  const results = useMonthlyExpenseDetailsQueries(
    periods.map(({ year, month }) => ({ year, month })),
  );
  // 선택한 달은 위 병렬 쿼리와 queryKey가 같아 캐시를 그대로 재사용한다.
  const { data: detail } = useMonthlyExpenseDetailQuery(selected);

  const trend = periods.map((period, index) => ({
    year: period.year,
    month: period.month,
    totalAmount: sumMonth(
      results[index].data.subscriptions,
      period.month,
      "ACTUAL",
    ),
  }));

  const selectedIndex = trend.findIndex(
    ({ year, month }) => year === selected.year && month === selected.month,
  );
  const totalAmount = sumMonth(detail.subscriptions, selected.month, "ACTUAL");
  // 이전 달이 추이 구간 밖이면 비교할 수가 없다. 문구를 통째로 생략한다.
  const changeAmount =
    selectedIndex > 0 ? totalAmount - trend[selectedIndex - 1].totalAmount : null;

  const billed = detail.subscriptions
    .filter(isCountable)
    .filter((item) => isBilledIn(item, selected.month));

  const rows: ExpenseRow[] = billed.map((item) => ({
    subscriptionId: item.subscriptionId,
    serviceName: item.serviceName,
    billingCycle: item.billingCycle,
    amount: item.originalPrice,
    note: item.billingCycle === "YEARLY" ? "1년치 결제 금액" : undefined,
    day: toDayOfMonth(item.firstBillingDate),
  }));

  const sumBy = (cycle: "MONTHLY" | "YEARLY") =>
    billed
      .filter((item) => item.billingCycle === cycle)
      .reduce((sum, item) => sum + item.originalPrice, 0);

  return (
    <ExpensesView
      model={{
        totalAmount,
        changeAmount,
        monthlyAmount: sumBy("MONTHLY"),
        yearlyAmount: sumBy("YEARLY"),
        trend,
        rows,
      }}
      selected={selected}
      onSelectMonth={onSelectMonth}
      yearlyLabel="연간 구독"
      emptyYearlyHint="이 달은 연간 결제가 없어요"
    />
  );
}

export default ActualView;
