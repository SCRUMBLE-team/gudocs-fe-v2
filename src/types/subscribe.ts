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
