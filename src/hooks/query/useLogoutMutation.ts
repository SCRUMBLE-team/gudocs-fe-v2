import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/auth";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 이전 사용자의 구독·지출 캐시가 다음 로그인에 새어나가지 않게 전부 버린다.
      queryClient.clear();
      // clear 직후 user는 undefined(=조회 중)라 가드가 스피너를 한 번 띄운다.
      // null로 못박아 "비로그인"이 확정된 상태로 만들어 바로 랜딩으로 보낸다.
      queryClient.setQueryData(["user"], null);
    },
  });
}
