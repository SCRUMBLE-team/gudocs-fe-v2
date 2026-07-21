import type { ApiResponse } from "../types/api";
import type {
  CategoryExpenseData,
  MonthlyExpense,
  TrendData,
} from "../types/expenses";
import { http } from "./httpClient";

export async function getMonthlyExpense({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const params = new URLSearchParams();
  if (year) params.set("year", String(year));
  if (month) params.set("month", String(month));

  const response = await http.get<ApiResponse<MonthlyExpense>>(
    `/api/subscriptions/expenses/monthly?${params}`,
  );

  return response.data;
}

export async function getCategoryExpenses({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const params = new URLSearchParams();
  if (year) params.set("year", String(year));
  if (month) params.set("month", String(month));

  const response = await http.get<ApiResponse<CategoryExpenseData>>(
    `/api/subscriptions/expenses/categories?${params}`,
  );

  return response.data;
}

export async function getExpensesTrends({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const params = new URLSearchParams();
  if (year) params.set("baseYear", String(year));
  if (month) params.set("baseMonth", String(month));

  const response = await http.get<ApiResponse<TrendData>>(
    `/api/subscriptions/expenses/trends?${params}`,
  );

  return response.data;
}

export async function getMonthlyExpenseDetails({
  year,
  month,
}: {
  year: number;
  month: number;
}) {
  const params = new URLSearchParams();
  if (year) params.set("year", String(year));
  if (month) params.set("month", String(month));

  const response = await http.get<ApiResponse<TrendData>>(
    `/api/subscriptions/expenses/monthly/details?${params}`,
  );

  return response.data;
}
