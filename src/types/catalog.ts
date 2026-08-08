import type { BillingCycle, SubscribeCategory } from "./subscribe";

/** 카탈로그가 제안하는 요금제. 등록 화면의 기본값이고 사용자가 고칠 수 있다. */
export type CatalogPlan = {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  /**
   * 달러 요금을 환산한 추정치. 실제 결제액은 결제 시점 환율과 해외결제 수수료에 따라
   * 달라지므로, 금액만 보여주지 말고 그렇다는 안내를 함께 띄운다.
   */
  approximate: boolean;
};

export type CatalogService = {
  /**
   * 불변 식별자(UPPER_SNAKE). 로고 파일명이 이 값이다.
   * 표시명(name)은 오타 수정·브랜드 변경으로 바뀌므로 키로 쓰면 안 된다.
   */
  code: string;
  name: string;
  category: SubscribeCategory;
  /**
   * 신규 등록 대상으로 고를 수 있는지. false면 등록 선택지에서 뺀다.
   * 종료된 서비스이거나(클로바X), 독립적으로 결제하는 구독 상품이 아닌 경우다(쿠팡이츠).
   * 과거 영수증 OCR 인식용으로만 카탈로그에 남아 있다.
   */
  selectable: boolean;
  /** 원화 정가를 확인하지 못한 서비스는 빈 배열이다. */
  plans: CatalogPlan[];
};

// GET /api/subscriptions/catalog
export type CatalogData = {
  /** 요금을 공개 자료로 확인한 날짜. "YYYY-MM-DD" */
  pricesCheckedOn: string;
  services: CatalogService[];
};
