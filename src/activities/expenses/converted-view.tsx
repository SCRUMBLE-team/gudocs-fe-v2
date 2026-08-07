import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { toDayOfMonth, type YearMonth } from "../../utils/date";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import {
  earliestSubscribedMonth,
  isListed,
  isPaused,
  recentTrend,
} from "../../utils/expenses";
import { formatWon } from "../../utils/format";
import ExpensesView, { type ExpenseRow } from "./expenses-view";

type Props = {
  /** 차트가 보여주는 6개월 창의 마지막 달. 화살표·피커로 옮긴다. */
  windowEnd: YearMonth;
  /** 실제 현재 달. 비교 문구의 기준이자 창의 상한이다. */
  current: YearMonth;
  onWindowEndChange: (period: YearMonth) => void;
  selected: YearMonth;
  onSelectMonth: (period: YearMonth) => void;
};

/**
 * 월 환산 기준.
 *
 * 총액·전월 대비·월간/연간 구성은 서버가 계산해 내려준 값을 그대로 쓴다.
 * 그래야 홈 요약 카드·소비 분석과 숫자가 항상 맞는다.
 */
function ConvertedView({
  windowEnd,
  current,
  onWindowEndChange,
  selected,
  onSelectMonth,
}: Props) {
  const { data: monthly } = useMonthlyExpenseQuery(selected);
  const { data: trends } = useExpensesTrendsQuery(windowEnd);
  const { data: detail } = useMonthlyExpenseDetailQuery(selected);
  // 비교 문구의 기준. 선택 달과 queryKey가 같으면 캐시를 그대로 쓴다.
  const { data: currentMonthly } = useMonthlyExpenseQuery(current);
  // 기간을 과거로 옮길 수 있는 하한을 구하려고 전체 구독을 받는다.
  const { data: subscriptions } = useSubscriptionsQuery({});

  const rows: ExpenseRow[] = detail.subscriptions
    .filter(isListed)
    .map((item) => ({
      subscriptionId: item.subscriptionId,
      serviceName: item.serviceName,
      billingCycle: item.billingCycle,
      amount: item.appliedMonthlyAmount,
      note:
        item.billingCycle === "YEARLY"
          ? `연 ${formatWon(item.originalPrice)} ÷ 12`
          : undefined,
      day: toDayOfMonth(item.firstBillingDate),
      isPaused: isPaused(item),
    }));

  return (
    <ExpensesView
      model={{
        totalAmount: monthly.totalAmount,
        currentAmount: currentMonthly.totalAmount,
        monthlyAmount: monthly.monthlySubscriptionAmount,
        yearlyAmount: monthly.annualSubscriptionMonthlyConvertedAmount,
        trend: recentTrend(trends.monthlyTrends),
        rows,
        earliestMonth: earliestSubscribedMonth(subscriptions),
      }}
      selected={selected}
      onSelectMonth={onSelectMonth}
      windowEnd={windowEnd}
      current={current}
      onWindowEndChange={onWindowEndChange}
      yearlyLabel="연간 구독 (월 환산)"
    />
  );
}

export default ConvertedView;
