import type { SubscribeCategory } from "./subscribe";

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
    billingCycle: string;
    originalPrice: number;
    appliedMonthlyAmount: number;
    billingDay: number;
    billingMonth: number;
    paymentMethod: string;
    status: string;
    deleted: boolean;
  }[];
}
