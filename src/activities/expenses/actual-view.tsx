import { useExpensesTrendsQuery } from "../../hooks/query/useExpensesTrendsQuery";
import { useMonthlyExpenseQuery } from "../../hooks/query/useMonthlyExpenseQuery";
import { useMonthlyExpensesQueries } from "../../hooks/query/useMonthlyExpensesQueries";
import { useMonthlyExpenseDetailQuery } from "../../hooks/query/useMonthlyExpensesDetailsQuery";
import {
  compareYearMonth,
  getTodayDayOfMonth,
  toDayOfMonth,
  toYearMonth,
  type YearMonth,
} from "../../utils/date";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";
import type { SubscriptionDetail } from "../../types/subscribe";
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
 * 상세 응답에 없는 구독을 0원 행으로 되살린다.
 *
 * 일시정지한 구독은 그 달 청구 기록이 없어 상세 응답에 아예 담기지 않는다.
 * 그대로 두면 목록에서 구독이 통째로 사라져서, 사용자에게는 등록해둔 구독이
 * 없어진 것처럼 보인다. 금액이 0이라 일자 그룹 합계도 총액도 그대로다.
 *
 * 이번 달에만 한다. 지난 달에 대해서는 그때 정지 상태였는지 알 방법이 없고
 * (paused_at은 마지막 정지 시각 하나뿐이라 재개하면 지워진다), 오늘 상태로
 * 과거를 단정하는 건 일자 합계에서 정지분을 빼던 것과 같은 종류의 버그다.
 *
 * 삭제된 구독은 따로 거르지 않아도 된다. 이 목록(GET /api/subscriptions)에는
 * 애초에 내려오지 않고, 상세 응답에 deleted로 남아 있는 건 아래 billedIds에
 * 이미 들어 있어 다시 붙지 않는다.
 */
function missingSubscriptionRows(
  subscriptions: SubscriptionDetail[],
  /** 그 달 상세 응답에 담겨 있던 구독 id. 여기 있으면 되살릴 필요가 없다. */
  billedIds: Set<number>,
  month: YearMonth,
): ExpenseRow[] {
  return subscriptions
    .filter((item) => !billedIds.has(item.id))
    // 그 달보다 뒤에 시작하는 구독은 그때 존재하지도 않았다. 유령 행이 된다.
    // (createdAt은 "2026-03-15T10:00:00" 꼴이지만 toYearMonth는 앞 두 칸만 본다.)
    .filter(
      (item) =>
        compareYearMonth(toYearMonth(item.firstBillingDate), month) <= 0 &&
        compareYearMonth(toYearMonth(item.createdAt), month) <= 0,
    )
    .map((item) => ({
      subscriptionId: item.id,
      serviceName: item.serviceName,
      serviceCode: item.serviceCode,
      billingCycle: item.billingCycle,
      amount: 0,
      day: toDayOfMonth(item.firstBillingDate),
      isPaused: item.status === "PAUSED",
    }));
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

  const billedRows: ExpenseRow[] = detail.subscriptions
    .filter(isListed)
    .filter((item) => isBilledIn(item, selected.month))
    .map((item) => ({
      subscriptionId: item.subscriptionId,
      serviceName: item.serviceName,
      serviceCode: item.serviceCode,
      billingCycle: item.billingCycle,
      amount: item.originalPrice,
      note: item.billingCycle === "YEARLY" ? "1년치 결제 금액" : undefined,
      day: toDayOfMonth(item.firstBillingDate),
      isPaused: isPaused(item),
    }));

  /*
   * 되살리는 기준은 상세 응답에 id가 있었는지다. billedRows가 아니라
   * detail.subscriptions 전체로 판단해야 한다 — 이 달에 청구되지 않는 연간
   * 구독은 응답에는 있지만 isBilledIn에서 걸러진 것이라, 0원 행으로 되붙이면
   * "실제 청구" 목록에 청구도 없는 행이 새로 생긴다.
   */
  const isCurrentMonth = compareYearMonth(selected, current) === 0;
  const rows = isCurrentMonth
    ? [
        ...billedRows,
        ...missingSubscriptionRows(
          subscriptions,
          new Set(detail.subscriptions.map((item) => item.subscriptionId)),
          selected,
        ),
      ]
    : billedRows;

  // 이번 달에 앞으로 더 빠져나갈 돈. 결제일이 오늘보다 뒤인 항목만 센다.
  // 여기는 지나간 청구가 아니라 앞으로의 예정액이라 정지분을 빼는 게 맞다.
  // 0원으로 되살린 행은 금액이 없어 어차피 영향이 없지만, 의도를 분명히 하려고
  // 이 달 청구분(billedRows)만 본다.
  const today = getTodayDayOfMonth();
  const upcomingAmount = billedRows
    .filter((row) => !row.isPaused && row.day > today)
    .reduce((sum, row) => sum + row.amount, 0);

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
