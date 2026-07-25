import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * 소셜 로그인 후 백엔드가 붙여 보내는 ?onboarding=1(이름이 없는 신규 유저)을
 * 감지해 온보딩 퍼널로 보낸다.
 *
 * 백엔드 리다이렉트 목적지 경로가 고정이 아닐 수 있어 콜백 전용 라우트 대신
 * 앱 레벨에서 감지한다. replace로 이동해 파라미터가 히스토리에 남지 않게 한다.
 */
export function useOnboardingRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isOnboarding = searchParams.get("onboarding") === "1";

  useEffect(() => {
    if (!isOnboarding) return;

    navigate("/onboarding", { replace: true });
  }, [isOnboarding, navigate]);
}
