import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubscriptions } from "../../api/subscribe";

/**
 * 구독 등록 뮤테이션. 성공 시 구독 목록과 지출(expenses) 쿼리를 무효화해
 * 홈이 새 구독을 반영하도록 한다.
 */
export function useCreateSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscriptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
