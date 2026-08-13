import type {
  BillingCycle,
  PaymentMethod,
  SubscribeCategory,
  SubscribeStatus,
} from "./subscribe";

// GET /api/subscriptions/expenses/monthly
export interface MonthlyExpense {
  year: number;
  month: number;
  totalAmount: number;
  previousMonthAmount: number;
  changeAmount: number;
  changeRate: number;
  // 월간 구독 합계. 연간 구독은 빠져 있다.
  monthlySubscriptionAmount: number;
  // 이 달에 실제로 청구되는 금액. 연간 구독은 청구되는 달에만 1년치가 잡힌다.
  // totalAmount(월 환산)와 일부러 다르다.
  actualAmount: number;
  // 연간 구독의 월 환산분. totalAmount에 이미 더해져 있다.
  annualSubscriptionMonthlyConvertedAmount: number;
}

// GET /api/subscriptions/expenses/categories
export interface CategoryExpenseData {
  year: number;
  month: number;
  totalAmount: number;
  categories: {
    category: SubscribeCategory;
    categoryName: string;
    amount: number;
    ratio: number;
    subscriptionCount: number;
  }[];
}

// GET /api/subscriptions/expenses/trends
export interface TrendData {
  baseYear: number;
  baseMonth: number;
  monthlyTrends: { year: number; month: number; totalAmount: number }[];
}

// GET /api/subscriptions/expenses/monthly/details

export interface MonthlyDetailData {
  year: number;
  month: number;
  totalAmount: number;
  subscriptions: {
    subscriptionId: number;
    serviceName: string;
    /** 카탈로그 code. 로고 조회 키. 직접 입력한 서비스는 null이다. */
    serviceCode: string | null;
    category: SubscribeCategory;
    categoryName: string;
    billingCycle: BillingCycle;
    // 구독에 등록된 원래 청구 금액. 연간이면 1년치다.
    // 그 달을 커버하는 기록의 금액이라, 청구가 없는 달에도 0이 아니다.
    originalPrice: number;
    // 월 환산 금액. 연간 구독은 서버가 originalPrice를 12로 나눠 매달 얹어준다.
    appliedMonthlyAmount: number;
    /**
     * 그 달에 결제일이 이미 지나 청구가 도래한 금액. 없으면 0이다.
     * (연간 구독이 커버 중인 달, 그 달 정지, 아직 결제일 전)
     */
    billedAmount: number;
    /** 그 달에 아직 결제일이 오지 않은 예정 금액. 없으면 0이다. */
    scheduledAmount: number;
    /**
     * 그 달에 도래한(또는 그 달을 커버 중인 기록의) 청구일. 청구가 아예 없으면 null.
     *
     * 그 달에 청구가 있었는지 가르는 유일한 단서다. 금액만으로는 연간 구독이
     * 커버 중인 달과 정지된 달을 구분할 수 없다.
     */
    billingDate: string | null;
    /**
     * 구독의 현재 앵커(최초 결제일). 다음 결제일 계산 기준이고 항상 값이 있다.
     * billingDate와 다른 값이다 — 그쪽은 그 달의 청구 기록을 가리킨다.
     */
    firstBillingDate: string;
    paymentMethod: PaymentMethod;
    /** 지금 이 순간의 상태. 그 달을 설명할 때 쓰면 안 된다 — statusInMonth를 쓸 것. */
    status: SubscribeStatus;
    /**
     * 그 달 기준 상태. 판정 시점은 그 달의 끝이고, 진행 중인 달이면 오늘이다.
     *
     * 표시용 라벨이다. 이 값으로 금액을 다시 계산하거나 합계에서 빼면
     * (예전 !isPaused 필터처럼) 실제로 나간 돈이 화면에서 사라진다.
     */
    statusInMonth: SubscribeStatus;
    deleted: boolean;
  }[];
}
