import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { toDayOfMonth } from "../../utils/date";
import { isCountable, recentTrend } from "../../utils/expenses";
import { formatWon } from "../../utils/format";
import ExpensesView, { type ExpenseRow } from "./expenses-view";

type Props = {
  /** 추이 구간의 기준 달. 선택 달이 바뀌어도 차트 구간은 여기에 고정된다. */
  base: { year: number; month: number };
  selected: { year: number; month: number };
  onSelectMonth: (period: { year: number; month: number }) => void;
};

/**
 * 월 환산 기준.
 *
 * 총액·전월 대비·월간/연간 구성은 서버가 계산해 내려준 값을 그대로 쓴다.
 * 그래야 홈 요약 카드·소비 분석과 숫자가 항상 맞는다.
 */
function ConvertedView({ base, selected, onSelectMonth }: Props) {
  const { data: monthly } = useMonthlyExpenseQuery(selected);
  const { data: trends } = useExpensesTrendsQuery(base);
  const { data: detail } = useMonthlyExpenseDetailQuery(selected);

  const rows: ExpenseRow[] = detail.subscriptions
    .filter(isCountable)
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
    }));

  return (
    <ExpensesView
      model={{
        totalAmount: monthly.totalAmount,
        changeAmount: monthly.changeAmount,
        monthlyAmount: monthly.monthlySubscriptionAmount,
        yearlyAmount: monthly.annualSubscriptionMonthlyConvertedAmount,
        trend: recentTrend(trends.monthlyTrends),
        rows,
      }}
      selected={selected}
      onSelectMonth={onSelectMonth}
      yearlyLabel="연간 구독 (월 환산)"
    />
  );
}

export default ConvertedView;
