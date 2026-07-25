import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/auth";

/**
 * 로그인한 유저.
 *
 * 가드는 "비로그인"을 예외가 아니라 정상 결과로 다뤄야 해서, 레포의 다른
 * 조회 훅과 달리 useSuspenseQuery가 아닌 useQuery를 쓴다. useSuspenseQuery는
 * 401을 throw해버려서 ErrorBoundary가 따로 필요해진다.
 */
export function useUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    // 401은 재시도해도 결과가 같다.
    retry: false,
    // 세션 동안 바뀌지 않는다. 이게 없으면 라우트를 옮길 때마다 /me를 다시 불러
    // 가드가 대기 상태로 떨어지고 화면이 스피너로 깜빡인다.
    staleTime: Infinity,
  });
}
