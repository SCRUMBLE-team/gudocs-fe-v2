import { CATEGORY_META } from "../../../constants/category";
import { BILLING_CYCLE_META } from "../../../constants/paymet";
import type {
  BillingCycle,
  OcrScanResult,
  SubscribeCategory,
} from "../../../types/subscribe";
import { fromISODate, toISODate } from "../../../utils/date";

/**
 * 폼 초기값으로 들어올 수 있는 날것의 입력.
 *
 * OCR 응답(숫자 price)과 액티비티 파라미터(URL을 거치면 전부 문자열)를 같은
 * 함수로 처리하려고 price를 둘 다 받는다.
 */
type SubscribeDraftInput = {
  category?: string | null;
  serviceName?: string | null;
  serviceCode?: string | null;
  price?: string | number | null;
  billingCycle?: string | null;
  firstBillingDate?: string | null;
};

/** 퍼널 폼의 초기값. SubscribeContextValue의 값 부분과 같은 모양이다. */
export type SubscribeDraft = {
  category: SubscribeCategory | null;
  service: string | null;
  serviceCode: string | null;
  price: number | null;
  billingCycle: BillingCycle | null;
  paymentDate: Date | null;
};

/** SubscribeNewConfirm 액티비티 파라미터. 전부 문자열이라 그대로 URL에 실린다. */
export type SubscribeConfirmParams = {
  category?: string;
  serviceName?: string;
  serviceCode?: string;
  price?: string;
  billingCycle?: string;
  firstBillingDate?: string;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toCategory(value: string | null | undefined) {
  // 서버가 코드 대신 레이블("영상")이나 모르는 값을 줄 수 있다.
  return value != null && value in CATEGORY_META
    ? (value as SubscribeCategory)
    : null;
}

function toBillingCycle(value: string | null | undefined) {
  return value != null && value in BILLING_CYCLE_META
    ? (value as BillingCycle)
    : null;
}

function toPrice(value: string | number | null | undefined) {
  if (value == null || value === "") return null;
  const price = Number(value);
  return Number.isSafeInteger(price) && price > 0 ? price : null;
}

function toPaymentDate(value: string | null | undefined) {
  // Date 파싱을 거치면 타임존 때문에 하루 밀릴 수 있어 문자열 형태부터 확인한다.
  if (value == null || !ISO_DATE.test(value)) return null;

  const date = fromISODate(value);
  if (Number.isNaN(date.getTime())) return null;

  // 2026-02-30 같은 없는 날짜는 Date가 조용히 다음 달로 넘겨버린다. 되짚어
  // 확인해서 걸러낸다 — 엉뚱한 날짜를 채워주느니 빈 칸으로 두는 게 정직하다.
  return toISODate(date) === value ? date : null;
}

/**
 * 날것의 입력을 폼 초기값으로 정규화한다. 어긋나는 필드만 null이 되고
 * 나머지는 살아남는다 — OCR이 일부만 맞혀도 맞힌 만큼은 채워주기 위해서다.
 */
export function toSubscribeDraft(input: SubscribeDraftInput): SubscribeDraft {
  const service = input.serviceName?.trim();
  const serviceCode = input.serviceCode?.trim();

  return {
    category: toCategory(input.category),
    service: service ? service : null,
    // 값 검증은 서버가 한다 — 카탈로그에 없는 code면 등록 요청이 400으로 막힌다.
    serviceCode: serviceCode ? serviceCode : null,
    price: toPrice(input.price),
    billingCycle: toBillingCycle(input.billingCycle),
    paymentDate: toPaymentDate(input.firstBillingDate),
  };
}

/**
 * OCR 결과를 확인 화면 파라미터로 옮긴다.
 *
 * 인식 실패(null)한 키는 아예 넣지 않는다. undefined를 담아두면 URL에
 * `?category=undefined`로 실릴 수 있어서다. 숫자는 문자열로 바꾸고, 값 검증은
 * 받는 쪽 toSubscribeDraft가 한 번 더 한다.
 *
 * 반환값이 빈 객체면 하나도 인식하지 못했다는 뜻이다.
 */
export function toConfirmParams(result: OcrScanResult): SubscribeConfirmParams {
  const params: SubscribeConfirmParams = {};

  if (result.category) params.category = result.category;
  if (result.serviceName) params.serviceName = result.serviceName;
  if (result.serviceCode) params.serviceCode = result.serviceCode;
  if (result.price != null) params.price = String(result.price);
  if (result.billingCycle) params.billingCycle = result.billingCycle;
  if (result.firstBillingDate) params.firstBillingDate = result.firstBillingDate;

  return params;
}
