import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expireUser } from "../../api/auth";

export function useExpireUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expireUser,
    onSuccess: () => {
      // 로그아웃과 같은 이유로 캐시를 비우고 user를 null로 못박는다.
      // clear()만 하면 user가 undefined(=조회 중)라 가드가 스피너를 한 번 띄운다.
      queryClient.clear();
      queryClient.setQueryData(["user"], null);
    },
  });
}
