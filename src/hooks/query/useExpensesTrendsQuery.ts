import { useSuspenseQuery } from "@tanstack/react-query";
import { getExpensesTrends } from "../../api/expenses";

export function useExpensesTrendsQuery(params: {
  year: number;
  month: number;
}) {
  return useSuspenseQuery({
    queryKey: ["expenses", "trends", params],
    queryFn: () => getExpensesTrends(params),
  });
}
