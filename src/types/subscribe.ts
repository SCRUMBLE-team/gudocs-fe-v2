import type { CATEGORY_META } from "../constants/category";

/** CATEGORY_META의 key들로부터 도출되는 카테고리 코드 */
export type SubscribeCategory = keyof typeof CATEGORY_META;

/** 카테고리 하나의 메타 정보 (label / emoji / examples) */
export type SubscribeCategoryMeta = (typeof CATEGORY_META)[SubscribeCategory];

/** CATEGORY_META의 label 값들로부터 도출되는 유니온 */
export type SubscribeCategoryLabel = SubscribeCategoryMeta["label"];

export type BillingCycle = "MONTHLY" | "YEARLY";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "SIMPLE_PAY" | "ETC";
export type SubscribeStatus = "ACTIVE" | "PAUSED";

/** 구독 등록·수정 요청 본문 */
export type CreateSubscribePayload = {
  category: SubscribeCategory;
  serviceName: string;
  /** 카탈로그 서비스의 불변 code. 직접 입력한 서비스는 null이다. */
  serviceCode: string | null;
  price: number;
  billingCycle: BillingCycle;
  /** 최근(최초) 결제일. "YYYY-MM-DD" — ex) "2026-07-15" */
  firstBillingDate: string;
};

/**
 * 서버 응답. 요청 본문에 없는 서버 파생 필드(id·status·paymentMethod·nextBillingDate 등)가
 * 붙으므로 CreateSubscribePayload를 상속하지 않고 따로 선언한다.
 */
export interface SubscriptionDetail {
  id: number;
  serviceName: string;
  /** 카탈로그 code. 로고 조회 키. 직접 입력한 서비스는 null이다. */
  serviceCode: string | null;
  category: SubscribeCategory;
  price: number;
  billingCycle: BillingCycle;
  /** "YYYY-MM-DD" */
  firstBillingDate: string;
  paymentMethod: PaymentMethod;
  status: SubscribeStatus;
  /** 서버가 계산한 다음 결제 예정일. "YYYY-MM-DD" */
  nextBillingDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 결제 알림 캡처·영수증 이미지의 OCR 인식 결과.
 *
 * 서버가 best-effort로 파싱하므로 어떤 필드든 null일 수 있다. 값이 와도 우리가
 * 아는 코드값이라는 보장이 없어서, 폼에 넣기 전에 toSubscribeDraft로 한 번 거른다.
 */
export type OcrScanResult = {
  serviceName: string | null;
  /** 카탈로그 매칭에 성공했을 때만 채워진다. 등록 요청에 그대로 실어 로고를 잇는다. */
  serviceCode: string | null;
  category: SubscribeCategory | null;
  price: number | null;
  billingCycle: BillingCycle | null;
  /** "YYYY-MM-DD" */
  firstBillingDate: string | null;
  /** 등록 요청 본문에는 없는 필드라 폼에서는 쓰지 않는다. */
  paymentMethod: PaymentMethod | null;
};
