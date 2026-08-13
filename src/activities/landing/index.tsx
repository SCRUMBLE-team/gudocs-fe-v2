import { useFlow, type StaticActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { VStack } from "@astryxdesign/core/VStack";
import { Button } from "@astryxdesign/core/Button";
import { Text } from "@astryxdesign/core/Text";
import FeatureCarousel from "./feature-carousel";
import logo from "../../assets/logo/logo.svg";

/**
 * 랜딩 화면.
 *
 * 로고 → 기능 캐러셀(카피 + 앱 미리보기) → CTA 한 개.
 * 캐러셀 세 장이 각각 통합 관리 · 절약 금액 · 알림을 맡고, CTA는 슬라이드마다
 * 반복하지 않고 아래에 한 번만 둔다.
 *
 * 모바일 세로 화면이 기준이다. PC에서도 폭만 max-w로 묶고 같은 레이아웃을 쓴다.
 */
const LandingActivity: StaticActivityComponentType<"Landing"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <div className="relative flex min-h-full flex-col overflow-hidden bg-surface pb-[max(20px,env(safe-area-inset-bottom))] pt-[max(24px,env(safe-area-inset-top))]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_0%,var(--color-accent-muted),transparent_68%)]" />

        {/* 캐러셀은 화면 폭을 그대로 써야 스냅이 자연스러워서, 좌우 여백은
            바깥이 아니라 안쪽 요소들이 각자 가진다. */}
        <div className="relative z-10 mx-auto flex w-full max-w-[420px] flex-1 flex-col">
          <header className="flex items-center gap-2 px-5" aria-label="gudocs">
            <img src={logo} alt="gudocs" className="h-8 w-auto" />
          </header>

          <main className="flex flex-1 flex-col justify-center py-6">
            <FeatureCarousel />
          </main>

          <VStack gap={2} className="px-5">
            <Button
              label="gudocs 시작하기"
              variant="primary"
              size="lg"
              onClick={() => push("Login", {})}
            />
            <Text type="supporting" color="secondary" justify="center">
              간편 로그인으로 바로 시작할 수 있어요
            </Text>
          </VStack>
        </div>
      </div>
    </AppScreen>
  );
};

export default LandingActivity;
