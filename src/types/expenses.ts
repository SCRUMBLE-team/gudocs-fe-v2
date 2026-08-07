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
    originalPrice: number;
    // 월 환산 금액. 연간 구독은 서버가 originalPrice를 12로 나눠 매달 얹어준다.
    appliedMonthlyAmount: number;
    firstBillingDate: string;
    paymentMethod: PaymentMethod;
    status: SubscribeStatus;
    deleted: boolean;
  }[];
}
