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
 * 서비스가 공지한 구독료 변경 예고.
 *
 * 사용자가 등록해둔 금액과 실제로 빠져나갈 금액이 달라지는 상황이라, 적용일 전에
 * 알려주는 게 이 서비스의 핵심 목적(결제 사고 방지)에 그대로 걸린다.
 */
export type PriceChange = {
  oldPrice: number;
  newPrice: number;
  /** 새 가격이 적용되는 날. "YYYY-MM-DD" */
  effectiveOn: string;
  /** 서비스가 변경을 공지한 날. "YYYY-MM-DD" */
  announcedOn: string;
  /** 공지 원문 링크 */
  sourceUrl: string;
};

/**
 * 서버 응답. 요청 본문에 없는 서버 파생 필드(id·status·nextBillingDate 등)가
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
  /** 목록 응답에는 내려오지 않는다. 화면에서 읽는 곳도 없어 선택 필드로 둔다. */
  paymentMethod?: PaymentMethod;
  status: SubscribeStatus;
  /** 서버가 계산한 다음 결제 예정일. "YYYY-MM-DD" */
  nextBillingDate: string;
  /** 예고된 구독료 변경. 예고가 없으면 null이다. */
  priceChange: PriceChange | null;
  /** 실제 결제 금액을 사용자가 확인해줘야 하는 상태인지 */
  priceReviewRequired: boolean;
  /** 구독 정리(절약 계산)에서 선택해둔 항목인지 */
  savingsSelected: boolean;
  createdAt: string;
  updatedAt: string;
  cancelUrl: string;
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
