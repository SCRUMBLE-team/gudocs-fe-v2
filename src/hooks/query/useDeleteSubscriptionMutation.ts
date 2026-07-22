import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubscription } from "../../api/subscribe";

/** 구독 삭제. 성공 시 목록·지출 쿼리를 무효화한다. */
export function useDeleteSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
