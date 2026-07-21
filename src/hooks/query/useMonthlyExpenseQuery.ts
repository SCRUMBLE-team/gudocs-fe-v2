import { useSuspenseQuery } from "@tanstack/react-query";
import { getMonthlyExpense } from "../../api/expenses";

export function useMonthlyExpenseQuery(params: {
  year: number;
  month: number;
}) {
  return useSuspenseQuery({
    queryKey: ["expenses", "monthly", params],
    queryFn: () => getMonthlyExpense(params),
  });
}
