import type { CreateSubscribePayload } from "../../../types/subscribe";
import { toISODate } from "../../../utils/date";
import type { SubscribeContextValue } from "./subscribe-context";

/**
 * 나눠 내는 인원으로 쪼갠 내 몫.
 *
 * 서버에 분할을 담을 필드가 없어서 총액 대신 내 몫을 저장한다. 홈·지출 합계가
 * 서버 계산값이라 이래야 대시보드 숫자가 실제 지출과 맞는다.
 *
 * 화면 안내 문구(share-count-field)와 실제 전송값이 어긋나면 안 되므로
 * 양쪽이 이 함수 하나를 같이 쓴다.
 */
export function splitPrice(price: number, shareCount: number) {
  // 망가진 값이 와도 나누지 않는 것으로 떨어뜨린다. 여기서 막아버리면
  // 사용자는 CTA가 왜 안 뜨는지 알 방법이 없다.
  const share =
    Number.isSafeInteger(shareCount) && shareCount > 0 ? shareCount : 1;
  return Math.round(price / share);
}

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
  const {
    category,
    service,
    serviceCode,
    billingCycle,
    price,
    paymentDate,
    shareCount,
  } = value;

  if (!category || !service || !billingCycle || price == null || !paymentDate) {
    return null;
  }
  return {
    category,
    // 퍼널 필드는 service, 서버는 serviceName. 어차피 담는 값은 서비스 '이름'이다.
    serviceName: service,
    // 카탈로그에서 고르지 않았으면 null. 서버 컬럼도 nullable이다.
    serviceCode: serviceCode ?? null,
    // 입력한 price는 총액이다. 저장하는 건 나눈 내 몫.
    price: splitPrice(price, shareCount),
    billingCycle,
    firstBillingDate: toISODate(paymentDate),
  };
}
