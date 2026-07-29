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
  monthlySubscriptionAmount: number;
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
