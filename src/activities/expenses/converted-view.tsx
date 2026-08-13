import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import { type YearMonth } from "../../utils/date";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import {
  anchorDayOf,
  earliestSubscribedMonth,
  isListed,
  isPausedInMonth,
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

  /*
   * 청구가 없던 구독도 서버가 0원 행으로 내려준다(그 달에 존재했고 삭제되지
   * 않은 것 전부). 전에는 정지 구독이 응답에서 빠져 목록에서 통째로 사라졌고,
   * 프론트가 이번 달에 한해 구독 목록에서 찾아 직접 붙이고 있었다.
   */
  const rows: ExpenseRow[] = detail.subscriptions
    .filter(isListed)
    .map((item) => ({
      subscriptionId: item.subscriptionId,
      serviceName: item.serviceName,
      serviceCode: item.serviceCode,
      billingCycle: item.billingCycle,
      amount: item.appliedMonthlyAmount,
      note:
        item.billingCycle === "YEARLY"
          ? `연 ${formatWon(item.originalPrice)} ÷ 12`
          : undefined,
      /*
       * 월 환산은 결제가 실제로 도래했는지와 무관하게 매달 금액이 잡히므로,
       * 그 달의 청구일이 아니라 앵커 기준 반복 결제일에 놓는다. 금액이 아예
       * 없는 행(그 달 정지)만 날짜 없이 "이 달 청구 없음"으로 내린다.
       */
      day: item.appliedMonthlyAmount > 0 ? anchorDayOf(item) : null,
      isPaused: isPausedInMonth(item),
    }));

  return (
    <ExpensesView
      model={{
        totalAmount: monthly.totalAmount,
        currentAmount: currentMonthly.totalAmount,
        // 이번 달을 볼 때는 이번 달끼리 비교할 수 없으니 지난달과 견준다.
        currentMonthNote: {
          kind: "PREVIOUS",
          amount: currentMonthly.previousMonthAmount,
        },
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
