import { useSuspenseQueries } from "@tanstack/react-query";
import { getMonthlyExpense } from "../../api/expenses";

/**
 * 여러 달의 월 지출 요약을 한 번에.
 *
 * 추이 응답(monthlyTrends)은 월 환산 총액만 주기 때문에 실제 청구 기준으로
 * 추이를 그리려면 달마다 actualAmount를 따로 받아야 한다.
 *
 * queryKey를 useMonthlyExpenseQuery와 똑같이 맞춰서 캐시를 공유한다.
 * 달 수만큼 요청이 나가므로 실제 청구 기준을 볼 때만 호출한다.
 */
export function useMonthlyExpensesQueries(
  periods: { year: number; month: number }[],
) {
  return useSuspenseQueries({
    queries: periods.map((period) => ({
      queryKey: ["expenses", "monthly", period],
      queryFn: () => getMonthlyExpense(period),
    })),
  });
}
