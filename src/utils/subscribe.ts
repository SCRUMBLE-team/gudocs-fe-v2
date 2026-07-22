import type { SubscriptionDetail } from "../types/subscribe";

type BillingInfo = Pick<
  SubscriptionDetail,
  "billingCycle" | "billingDay" | "billingMonth"
>;

/** 반복 결제일 표기. 월간 "매월 15일", 연간 "매년 7월 15일". */
export function billingText(item: BillingInfo): string {
  if (item.billingCycle === "YEARLY" && item.billingMonth != null) {
    return `매년 ${item.billingMonth}월 ${item.billingDay}일`;
  }
  return `매월 ${item.billingDay}일`;
}

/**
 * billingDay(+연간이면 billingMonth)로부터 최근 결제일 Date를 복원한다.
 * 퍼널 필드는 결제일을 Date로 다루지만 구독은 반복 결제라 연도는 무의미하며,
 * 제출 시 toSubscribePayload가 다시 일/월만 뽑아낸다.
 *
 * 월간은 어떤 달로 두든 일(日)만 쓰이므로, 1~31일을 모두 담을 수 있는 1월을
 * 써서 말일 잘림을 피한다. 연간은 원본 billingMonth를 그대로 쓴다.
 */
export function toPaymentDate(item: BillingInfo): Date {
  const year = new Date().getFullYear();
  const monthIndex =
    item.billingCycle === "YEARLY" && item.billingMonth != null
      ? item.billingMonth - 1
      : 0;
  return new Date(year, monthIndex, item.billingDay);
}
