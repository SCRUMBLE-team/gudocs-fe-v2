import type { CreateSubscribePayload } from "../../../types/subscribe";
import type { SubscribeContextValue } from "./subscribe-context";

/**
 * 퍼널에 모인 값들을 등록 요청 본문으로 조립한다.
 *
 * 퍼널은 결제일을 `Date`로 들고 있지만 구독은 반복 결제라 연도가 의미 없다.
 * 월간이면 일(日)만, 연간이면 월/일만 남긴다.
 *
 * 하나라도 비어 있으면 null을 반환한다. CTA 노출 조건과 페이로드 조립이
 * 같은 함수를 보게 해서 "다 채웠는가"의 기준이 두 곳으로 갈라지지 않게 한다.
 */
export function toSubscribePayload(
  value: SubscribeContextValue,
): CreateSubscribePayload | null {
  const { category, service, billingCycle, price, paymentDate } = value;

  if (!category || !service || !billingCycle || price == null || !paymentDate) {
    return null;
  }

  return {
    category,
    service,
    price,
    billingCycle,
    billingDay: paymentDate.getDate(),
    billingMonth: billingCycle === "YEARLY" ? paymentDate.getMonth() + 1 : null,
  };
}
