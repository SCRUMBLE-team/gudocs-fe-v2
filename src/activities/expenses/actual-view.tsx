import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useMonthlyExpensesQueries } from "../../hooks/query/useMonthlyExpensesQueries";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import {
  compareYearMonth,
  toYearMonth,
  type YearMonth,
} from "../../utils/date";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import {
  anchorDayOf,
  billedDayOf,
  earliestSubscribedMonth,
  isListed,
  isPausedInMonth,
  recentTrend,
  type BillingItem,
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
 * 실제 청구 기준에서 이 행을 어느 날에 놓을지.
 *
 * 1) 그 달에 청구가 도래했으면 그 청구일.
 * 2) 아직 결제일 전이면 앵커 기준 반복 결제일. billingDate는 도래한 기록만
 *    가리키므로, 25일에 나갈 결제는 여기서 날짜를 얻어야 한다.
 * 3) 둘 다 아니면 날짜가 없다(정지된 달, 연간 구독이 커버 중인 달). 특히 커버
 *    중인 달의 billingDate는 실제로 결제된 '다른 달'의 날짜라, 그대로 쓰면
 *    8월 목록에 1월 결제가 "8월 15일"로 찍힌다.
 */
function billingDayFor(item: BillingItem, month: YearMonth): number | null {
  const billedOn = item.billingDate ? toYearMonth(item.billingDate) : null;
  if (billedOn && compareYearMonth(billedOn, month) === 0) {
    return billedDayOf(item);
  }
  return item.scheduledAmount > 0 ? anchorDayOf(item) : null;
}

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

  /*
   * 청구가 없던 구독도 서버가 0원 행으로 내려준다. 결제주기·앵커를 프론트에서
   * 되계산하던 isBilledIn은 필요 없어졌다 — 그 달 청구 여부는 billingDate가,
   * 금액은 billedAmount/scheduledAmount가 답한다.
   */
  const listed = detail.subscriptions.filter(isListed);

  const rows: ExpenseRow[] = listed.map((item) => {
    // 한 달에 둘 중 하나만 잡힌다. 결제일이 지났으면 billedAmount, 아직이면 scheduledAmount.
    const amount = item.billedAmount + item.scheduledAmount;

    return {
      subscriptionId: item.subscriptionId,
      serviceName: item.serviceName,
      serviceCode: item.serviceCode,
      billingCycle: item.billingCycle,
      amount,
      // 금액이 붙은 연간 행에만 설명을 단다. 커버 중인 달은 0원이라 붙일 말이 없다.
      note:
        item.billingCycle === "YEARLY" && amount > 0
          ? "1년치 결제 금액"
          : undefined,
      day: billingDayFor(item, selected),
      isPaused: isPausedInMonth(item),
    };
  });

  /*
   * 이번 달에 앞으로 더 빠져나갈 돈.
   *
   * 서버가 "아직 결제일이 오지 않은 금액"으로 따로 내려주므로 오늘 날짜와
   * 비교할 필요가 없다. 지난 달을 보고 있으면 전부 0이라 저절로 0이 된다.
   */
  const upcomingAmount = listed.reduce(
    (sum, item) => sum + item.scheduledAmount,
    0,
  );

  return (
    <ExpensesView
      model={{
        totalAmount: monthly.actualAmount,
        currentMonthNote: { kind: "UPCOMING", amount: upcomingAmount },
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
