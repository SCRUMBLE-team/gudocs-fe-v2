import type { CreateSubscribePayload } from "../../../types/subscribe";
import { toISODate } from "../../../utils/date";
import type { SubscribeContextValue } from "./subscribe-context";

/**
 * 퍼널에 모인 값들을 등록 요청 본문으로 조립한다.
 *
 * 퍼널은 결제일을 `Date`로 들고 있고 서버는 "YYYY-MM-DD"를 받으므로 직렬화한다.
 *
 * 하나라도 비어 있으면 null을 반환한다. CTA 노출 조건과 페이로드 조립이
 * 같은 함수를 보게 해서 "다 채웠는가"의 기준이 두 곳으로 갈라지지 않게 한다.
 */
export function toSubscribePayload(
  value: SubscribeContextValue,
): CreateSubscribePayload | null {
  const { category, service, serviceCode, billingCycle, price, paymentDate } =
    value;

  if (!category || !service || !billingCycle || price == null || !paymentDate) {
    return null;
  }
  return {
    category,
    // 퍼널 필드는 service, 서버는 serviceName. 어차피 담는 값은 서비스 '이름'이다.
    serviceName: service,
    // 카탈로그에서 고르지 않았으면 null. 서버 컬럼도 nullable이다.
    serviceCode: serviceCode ?? null,
    price,
    billingCycle,
    firstBillingDate: toISODate(paymentDate),
  };
}
