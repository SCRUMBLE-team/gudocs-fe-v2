import type { SubscriptionDetail } from "../types/subscribe";

type BillingInfo = Pick<SubscriptionDetail, "billingCycle" | "firstBillingDate">;

/**
 * 반복 결제일 표기. 월간 "매월 15일", 연간 "매년 7월 15일".
 *
 * firstBillingDate는 "YYYY-MM-DD"라 split만으로 월/일을 얻을 수 있다.
 * Date를 거치면 타임존 때문에 날짜가 밀릴 수 있어 문자열 그대로 다룬다.
 */
export function billingText(item: BillingInfo): string {
  const [, month, day] = item.firstBillingDate.split("-");
  const dayText = `${Number(day)}일`;

  if (item.billingCycle === "YEARLY") {
    return `매년 ${Number(month)}월 ${dayText}`;
  }
  return `매월 ${dayText}`;
}
