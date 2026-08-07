import type { BillingCycle, SubscribeCategory } from "./subscribe";

/** 카탈로그가 제안하는 요금제. 등록 화면의 기본값이고 사용자가 고칠 수 있다. */
export type CatalogPlan = {
  name: string;
  price: number;
  billingCycle: BillingCycle;
};

export type CatalogService = {
  /**
   * 불변 식별자(UPPER_SNAKE). 로고 파일명이 이 값이다.
   * 표시명(name)은 오타 수정·브랜드 변경으로 바뀌므로 키로 쓰면 안 된다.
   */
  code: string;
  name: string;
  category: SubscribeCategory;
  /** 종료된 서비스. 등록 선택지에서 빼되, 과거 데이터 표시용으로는 남는다. */
  discontinued: boolean;
  /** 원화 정가를 확인하지 못한 서비스는 빈 배열이다. */
  plans: CatalogPlan[];
};

// GET /api/subscriptions/catalog
export type CatalogData = {
  /** 요금을 공개 자료로 확인한 날짜. "YYYY-MM-DD" */
  pricesCheckedOn: string;
  services: CatalogService[];
};
