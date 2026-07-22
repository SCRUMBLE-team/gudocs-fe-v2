import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editSubscription } from "../../api/subscribe";

/**
 * 구독 수정. 성공 시 목록·해당 상세·지출 쿼리를 무효화한다.
 */
export function useEditSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editSubscription,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["subscription", variables.subscriptionId],
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
