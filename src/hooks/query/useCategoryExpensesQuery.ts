import { useSuspenseQuery } from "@tanstack/react-query";
import { getCategoryExpenses } from "../../api/expenses";

export function useCategoryExpensesQuery(params: {
  year: number;
  month: number;
}) {
  return useSuspenseQuery({
    queryKey: ["expenses", "categories", params],
    queryFn: () => getCategoryExpenses(params),
  });
}
