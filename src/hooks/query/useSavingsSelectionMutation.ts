import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savingsSelection } from "../../api/subscribe";

/**
 * 정리 대상으로 고른 구독들을 서버에 등록한다.
 * 서버가 구독 정보를 갱신해 돌려주므로 목록·지출 쿼리를 무효화한다.
 */
export function useSavingsSelectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savingsSelection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
