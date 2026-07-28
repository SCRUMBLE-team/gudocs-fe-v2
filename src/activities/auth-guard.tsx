// 이 파일은 컴포넌트가 아니라 컴포넌트를 만들어 내는 HOC를 내보낸다.
// fast refresh 규칙은 컴포넌트만 내보내는 파일을 전제로 해서 여기서는 끈다.
/* eslint-disable react-refresh/only-export-components */
import { useEffect } from "react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import type { RegisteredActivityName } from "@stackflow/config";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useUserQuery } from "../hooks/query/useUserQuery";

/**
 * 로그인 여부로 화면을 나누는 가드 한 쌍.
 *
 * 둘은 같은 쿼리를 보고 같은 대기 화면을 공유해서 한 파일에 둔다. 떼어놓으면
 * AuthPending이 양쪽에 중복된다.
 *
 * Stackflow에는 <Navigate>에 해당하는 선언형 API가 없어 렌더 도중에 화면을 바꿀 수
 * 없다. 그래서 라우트를 감싸는 레이아웃이 아니라 액티비티 컴포넌트를 감싸는
 * HOC로 만들고, 이동은 effect에서 replace로 처리한다. 등록은 stackflow.tsx의
 * components 맵에서 한다.
 */

// 세션을 확인하는 동안 붙잡아 둔다. 이게 없으면 /me 응답이 오기 전에
// 랜딩이나 홈이 한 번 번쩍였다 사라진다.
// 가드가 원래 액티비티를 대신해 렌더되는 자리라 AppScreen까지 직접 그려야
// 스택 안에서 제 위치를 잡는다.
function AuthPending() {
  return (
    <AppScreen>
      <VStack height="100%" align="center" justify="center">
        <Spinner size="lg" />
      </VStack>
    </AppScreen>
  );
}

/** 로그인 + 이름이 있어야 통과한다. 앱 본체 액티비티를 감싼다. */
export function withAuth<Name extends RegisteredActivityName>(
  Activity: StaticActivityComponentType<Name>,
): StaticActivityComponentType<Name> {
  return function Guarded(props) {
    const { data: user, isPending, isError } = useUserQuery();
    const { replace } = useFlow();

    const hasName = Boolean(user?.name?.trim());

    useEffect(() => {
      if (isPending) return;

      // animate: false가 react-router의 replace: true 역할을 한다. 애니메이션 없이
      // 현재 화면을 갈아끼워야 히스토리에 리다이렉트가 쌓여 뒤로 가기가 튕김 루프에
      // 빠지는 일이 없다.
      if (isError || !user) {
        replace("Landing", {}, { animate: false });
        return;
      }

      // 온보딩을 중간에 이탈한 유저를 다시 데려간다.
      // 소셜 로그인 직후 붙는 ?onboarding=1도 결국 이 조건에 걸린다.
      if (!hasName) {
        replace("Onboarding", {}, { animate: false });
      }
    }, [isPending, isError, user, hasName, replace]);

    // replace가 반영되기 전 한 프레임 동안 보호 대상 화면이 새어나가지 않게 막는다.
    if (isPending || isError || !user || !hasName) return <AuthPending />;

    return <Activity {...props} />;
  };
}

/** 비로그인 전용. 이미 로그인했다면 볼 이유가 없는 화면들을 감싼다. */
export function publicOnly<Name extends RegisteredActivityName>(
  Activity: StaticActivityComponentType<Name>,
): StaticActivityComponentType<Name> {
  return function PublicOnly(props) {
    const { data: user, isPending } = useUserQuery();
    const { replace } = useFlow();

    useEffect(() => {
      if (isPending || !user) return;
      replace("Home", {}, { animate: false });
    }, [isPending, user, replace]);

    if (isPending || user) return <AuthPending />;

    return <Activity {...props} />;
  };
}
