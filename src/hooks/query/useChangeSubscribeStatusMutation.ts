import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeSubscribeStatus } from "../../api/subscribe";

/**
 * 구독 상태(ACTIVE/PAUSED) 변경. 성공 시 목록·해당 상세·지출 쿼리를 무효화한다.
 */
export function useChangeSubscribeStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeSubscribeStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["subscription", variables.subscriptionId],
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
