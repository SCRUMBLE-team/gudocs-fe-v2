import { useSuspenseQueries } from "@tanstack/react-query";
import { getMonthlyExpenseDetails } from "../../api/expenses";

/**
 * 여러 달의 지출 상세를 한 번에.
 *
 * queryKey를 useMonthlyExpenseDetailQuery와 똑같이 맞춰서 캐시를 공유한다.
 * 홈·소비 분석에서 이미 불러온 달은 재요청되지 않는다.
 *
 * 달 수만큼 요청이 나가므로 실제 청구 기준을 볼 때만 호출한다.
 */
export function useMonthlyExpenseDetailsQueries(
  periods: { year: number; month: number }[],
) {
  return useSuspenseQueries({
    queries: periods.map((period) => ({
      queryKey: ["expenses", "monthly", "detail", period],
      queryFn: () => getMonthlyExpenseDetails(period),
    })),
  });
}
