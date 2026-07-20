import type { CATEGORY_META } from "../constants/category";

/** CATEGORY_META의 key들로부터 도출되는 카테고리 코드 */
export type SubscribeCategory = keyof typeof CATEGORY_META;

/** 카테고리 하나의 메타 정보 (label / emoji / examples) */
export type SubscribeCategoryMeta = (typeof CATEGORY_META)[SubscribeCategory];

/** CATEGORY_META의 label 값들로부터 도출되는 유니온 */
export type SubscribeCategoryLabel = SubscribeCategoryMeta["label"];

export type BillingCycle = "MONTHLY" | "YEARLY";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "SIMPLE_PAY" | "ETC";

/** 구독 등록 요청 본문 */
export type CreateSubscribePayload = {
  category: SubscribeCategory;
  service: string;
  price: number;
  billingCycle: BillingCycle;
  /** 1-31 */
  billingDay: number;
  /** 1-12. billingCycle이 MONTHLY면 null */
  billingMonth: number | null;
};
