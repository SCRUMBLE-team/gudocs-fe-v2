import type { MonthlyDetailData, TrendData } from "../types/expenses";
import { toYearMonth } from "./date";

/**
 * 추이 차트에 그릴 최대 개월 수.
 *
 * 실제 청구 기준은 이 개월 수만큼 상세 요청이 병렬로 나간다. 웹뷰에서 감당할
 * 만큼으로 잘라두고, 두 기준이 같은 구간을 보도록 양쪽 다 이 값을 쓴다.
 */
const MAX_TREND_MONTHS = 6;

/** 추이 응답에서 최근 구간만 남긴다. 서버가 더 긴 구간을 내려줘도 화면은 일정하다. */
export function recentTrend(monthlyTrends: TrendData["monthlyTrends"]) {
  return monthlyTrends.slice(-MAX_TREND_MONTHS);
}

/**
 * 지출 금액을 세는 두 가지 기준.
 *
 * CONVERTED — 연간 구독을 12로 나눠 매달 얹는다. 서버가 totalAmount /
 *   appliedMonthlyAmount를 이 기준으로 내려주므로 홈·소비 분석 숫자와 항상 맞는다.
 * ACTUAL — 그 달에 실제로 청구되는 금액. 연간 구독은 청구되는 달에만 1년치가 잡히고
 *   나머지 달엔 0이다. 서버 수치와 일부러 어긋나므로 화면에 기준을 밝혀야 한다.
 */
export type AmountBasis = "CONVERTED" | "ACTUAL";

export type BillingItem = MonthlyDetailData["subscriptions"][number];

/**
 * 지출로 셀 항목인지.
 *
 * 삭제된 구독은 서버가 이력 때문에 계속 내려주고, 일시정지된 구독은 결제가 나가지
 * 않는다. 둘 다 "이 달에 실제로 쓴 돈"이 아니라서 뺀다.
 */
export function isCountable(item: BillingItem): boolean {
  return !item.deleted && item.status === "ACTIVE";
}

/**
 * 이 달에 실제로 청구되는 항목인지.
 *
 * 월간은 매달 청구된다. 연간은 firstBillingDate와 같은 '월'에만 청구되므로
 * 일(day)은 보지 않는다.
 */
export function isBilledIn(item: BillingItem, month: number): boolean {
  if (item.billingCycle === "MONTHLY") return true;
  return toYearMonth(item.firstBillingDate).month === month;
}

/** 기준에 따른 이 달 금액. 청구되지 않는 달의 연간 구독은 0이다. */
export function amountFor(
  item: BillingItem,
  month: number,
  basis: AmountBasis,
): number {
  if (basis === "CONVERTED") return item.appliedMonthlyAmount;
  return isBilledIn(item, month) ? item.originalPrice : 0;
}

/** 한 달치 구독 목록의 합계. 셀 수 없는 항목과 청구되지 않는 달은 자동으로 빠진다. */
export function sumMonth(
  subscriptions: BillingItem[],
  month: number,
  basis: AmountBasis,
): number {
  return subscriptions
    .filter(isCountable)
    .reduce((sum, item) => sum + amountFor(item, month, basis), 0);
}
