import { Navigate, Outlet } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useUserQuery } from "../hooks/query/useUserQuery";

/**
 * 로그인 여부로 라우트를 나누는 가드 한 쌍.
 *
 * 둘은 같은 쿼리를 보고 같은 대기 화면을 공유해서 한 파일에 둔다. 떼어놓으면
 * AuthPending이 양쪽에 중복된다.
 */

// 세션을 확인하는 동안 붙잡아 둔다. 이게 없으면 /me 응답이 오기 전에
// 랜딩이나 홈이 한 번 번쩍였다 사라진다.
function AuthPending() {
  return (
    <VStack className="flex-1" align="center" justify="center">
      <Spinner size="lg" />
    </VStack>
  );
}

/** 로그인 + 이름이 있어야 통과한다. 앱 본체 라우트를 감싼다. */
export function RequireAuth() {
  const { data: user, isPending, isError } = useUserQuery();

  if (isPending) return <AuthPending />;

  // replace를 쓰지 않으면 히스토리에 리다이렉트가 쌓여 뒤로 가기가 튕김 루프에 빠진다.
  if (isError || !user) return <Navigate to="/landing" replace />;

  // 온보딩을 중간에 이탈한 유저를 다시 데려간다.
  if (!user.name?.trim()) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}

/** 비로그인 전용. 이미 로그인했다면 볼 이유가 없는 화면들을 감싼다. */
export function PublicOnlyRoute() {
  const { data: user, isPending } = useUserQuery();

  if (isPending) return <AuthPending />;
  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
