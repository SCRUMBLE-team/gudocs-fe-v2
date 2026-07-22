import { useSuspenseQuery } from "@tanstack/react-query";
import { getMonthlyExpenseDetails } from "../../api/expenses";

export function useMonthlyExpenseDetailQuery(params: {
  year: number;
  month: number;
}) {
  return useSuspenseQuery({
    queryKey: ["expenses", "monthly", "detail", params],
    queryFn: () => getMonthlyExpenseDetails(params),
  });
}
