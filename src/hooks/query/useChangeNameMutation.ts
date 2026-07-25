import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeName } from "../../api/auth";

export function useChangeNameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeName,
    // 프로미스를 반환해 재조회가 끝날 때까지 뮤테이션을 완료로 치지 않는다.
    // 이걸 기다리지 않으면 호출부의 onSuccess가 먼저 홈으로 이동해버리고,
    // RequireAuth가 이름이 아직 비어 있는 캐시를 읽어 온보딩으로 되돌린다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
}
