import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useMonthlyExpensesQueries } from "../../hooks/query/useMonthlyExpensesQueries";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { toDayOfMonth, type YearMonth } from "../../utils/date";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import {
  earliestSubscribedMonth,
  isBilledIn,
  isListed,
  isPaused,
  recentTrend,
} from "../../utils/expenses";
import ExpensesView, { type ExpenseRow } from "./expenses-view";

type Props = {
  windowEnd: YearMonth;
  current: YearMonth;
  onWindowEndChange: (period: YearMonth) => void;
  selected: YearMonth;
  onSelectMonth: (period: YearMonth) => void;
};

/**
 * 실제 청구 기준.
 *
 * 총액은 서버가 actualAmount로 내려준다 — 연간 구독을 청구되는 달에만 1년치로
 * 잡은 값이라 프론트에서 다시 셀 필요가 없다. 일시정지·삭제 구독을 어떻게
 * 세느냐도 서버 정책 하나로 통일된다.
 *
 * 추이 응답은 월 환산 총액만 주므로 달마다 actualAmount를 따로 받는다.
 * (요청이 달 수만큼 나가서 이 기준을 골랐을 때만 마운트된다.)
 */
function ActualView({
  windowEnd,
  current,
  onWindowEndChange,
  selected,
  onSelectMonth,
}: Props) {
  const { data: trends } = useExpensesTrendsQuery(windowEnd);
  const periods = recentTrend(trends.monthlyTrends);

  const results = useMonthlyExpensesQueries(
    periods.map(({ year, month }) => ({ year, month })),
  );
  // 선택한 달은 위 병렬 쿼리와 queryKey가 같아 캐시를 그대로 재사용한다.
  const { data: monthly } = useMonthlyExpenseQuery(selected);
  // 목록에 무엇이 찍히는지는 상세에서만 알 수 있다.
  const { data: detail } = useMonthlyExpenseDetailQuery(selected);
  // 비교 문구의 기준. 창을 과거로 옮겨도 이 값은 늘 실제 현재 달이다.
  const { data: currentMonthly } = useMonthlyExpenseQuery(current);
  // 기간을 과거로 옮길 수 있는 하한을 구하려고 전체 구독을 받는다.
  const { data: subscriptions } = useSubscriptionsQuery({});

  const trend = periods.map((period, index) => ({
    year: period.year,
    month: period.month,
    totalAmount: results[index].data.actualAmount,
  }));

  const rows: ExpenseRow[] = detail.subscriptions
    .filter(isListed)
    .filter((item) => isBilledIn(item, selected.month))
    .map((item) => ({
      subscriptionId: item.subscriptionId,
      serviceName: item.serviceName,
      billingCycle: item.billingCycle,
      amount: item.originalPrice,
      note: item.billingCycle === "YEARLY" ? "1년치 결제 금액" : undefined,
      day: toDayOfMonth(item.firstBillingDate),
      isPaused: isPaused(item),
    }));

  return (
    <ExpensesView
      model={{
        totalAmount: monthly.actualAmount,
        currentAmount: currentMonthly.actualAmount,
        monthlyAmount: monthly.monthlySubscriptionAmount,
        // 실제 청구액에서 월간분을 뺀 나머지가 이 달에 빠져나가는 연간 결제분이다.
        yearlyAmount: monthly.actualAmount - monthly.monthlySubscriptionAmount,
        trend,
        rows,
        earliestMonth: earliestSubscribedMonth(subscriptions),
      }}
      selected={selected}
      onSelectMonth={onSelectMonth}
      windowEnd={windowEnd}
      current={current}
      onWindowEndChange={onWindowEndChange}
      yearlyLabel="연간 구독"
      emptyYearlyHint="이 달은 연간 결제가 없어요"
    />
  );
}

export default ActualView;
