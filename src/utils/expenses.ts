import type { MonthlyDetailData, TrendData } from "../types/expenses";
import type { SubscriptionDetail } from "../types/subscribe";
import { compareYearMonth, toYearMonth, type YearMonth } from "./date";

/**
 * 추이 차트에 그릴 최대 개월 수.
 *
 * 실제 청구 기준은 이 개월 수만큼 상세 요청이 병렬로 나간다. 웹뷰에서 감당할
 * 만큼으로 잘라두고, 두 기준이 같은 구간을 보도록 양쪽 다 이 값을 쓴다.
 */
const MAX_TREND_MONTHS = 6;

/**
 * 구독을 처음 등록한 달. 하나도 없으면 null.
 *
 * 추이 차트가 과거로 갈 수 있는 하한이다. 그보다 앞은 서버가 0만 돌려주므로
 * (지출 집계는 createdAt 기준이다) 빈 막대만 늘어선 화면을 보게 된다.
 *
 * createdAt은 "2026-03-15T10:00:00" 꼴이라 앞 7자리만 잘라 쓴다. Date로 파싱하면
 * 타임존 때문에 월이 밀릴 수 있다.
 */
export function earliestSubscribedMonth(
  subscriptions: SubscriptionDetail[],
): YearMonth | null {
  let earliest: YearMonth | null = null;

  for (const { createdAt } of subscriptions) {
    const [year, month] = createdAt.slice(0, 7).split("-").map(Number);
    if (!year || !month) continue;

    const candidate = { year, month };
    if (!earliest || compareYearMonth(candidate, earliest) < 0) {
      earliest = candidate;
    }
  }

  return earliest;
}

/** 추이 응답에서 최근 구간만 남긴다. 서버가 더 긴 구간을 내려줘도 화면은 일정하다. */
export function recentTrend(monthlyTrends: TrendData["monthlyTrends"]) {
  return monthlyTrends.slice(-MAX_TREND_MONTHS);
}

/**
 * 지출 금액을 세는 두 가지 기준. 총액은 양쪽 다 서버가 내려준다.
 *
 * CONVERTED — 연간 구독을 12로 나눠 매달 얹는다(totalAmount).
 *   홈 요약 카드·소비 분석이 쓰는 기준이라 숫자가 항상 맞는다.
 * ACTUAL — 그 달에 실제로 청구되는 금액(actualAmount). 연간 구독은 청구되는
 *   달에만 1년치가 잡힌다. CONVERTED와 일부러 어긋나므로 화면에 기준을 밝힌다.
 */
export type AmountBasis = "CONVERTED" | "ACTUAL";

export type BillingItem = MonthlyDetailData["subscriptions"][number];

/**
 * 목록에 띄울 항목인지.
 *
 * 삭제된 구독만 뺀다 — 서버가 이력 때문에 계속 내려주지만 화면에 띄울 이유가 없다.
 * 일시정지는 결제가 나가지 않을 뿐 구독은 살아 있으므로, 목록에는 두고 흐리게
 * 표시한다(isPaused).
 */
export function isListed(item: BillingItem): boolean {
  return !item.deleted;
}

/** 결제가 멈춘 구독인지. 목록에서 흐리게 그리고 합계에서 뺀다. */
export function isPaused(item: BillingItem): boolean {
  return item.status === "PAUSED";
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
