import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { basicUIPlugin } from "@stackflow/plugin-basic-ui";
import { historySyncPlugin } from "@stackflow/plugin-history-sync";
import "@stackflow/plugin-basic-ui/index.css";
import { config } from "./stackflow.config";
import { publicOnly, withAuth } from "./activities/auth-guard";
import LandingActivity from "./activities/landing";
import LoginActivity from "./activities/login";
import OnboardingActivity from "./activities/onboarding";
import HomeActivity from "./activities/home";
import SubscribeActivity from "./activities/subscribe";
import AnalyzeActivity from "./activities/analyze";
import ExpensesActivity from "./activities/expenses";
import SubscribeNewStartActivity from "./activities/subscribe/new/start";
import SubscribeNewActivity from "./activities/subscribe/new";
import SubscribeNewPayActivity from "./activities/subscribe/new/pay";
import SubscribeNewConfirmActivity from "./activities/subscribe/new/confirm";
import SubscribeDetailActivity from "./activities/subscribe/detail";
import SubscribeEditActivity from "./activities/subscribe/detail/edit";

/**
 * AppScreen 안쪽 스크롤 규칙.
 *
 * basic-ui가 그리는 내용 영역(paperContent)은 이미
 * `position: absolute; inset: 0; overflow-y: scroll`이다. 그 안에 스크롤
 * 컨테이너를 또 두면 화면 전환 중 transform이 걸린 채로 중첩 스크롤이
 * 리페인트되면서 내용이 덜컹거린다.
 *
 * 그래서 각 화면의 최상위 VStack은 `height 100% + isScrollable`이 아니라
 * `minHeight="100%"`로 두고 스크롤은 paperContent 하나에 맡긴다.
 * 하단 CTA의 `sticky bottom-0`도 이 스크롤 영역을 기준으로 붙는다.
 * (탭 화면만 예외다. 이유는 activities/layout.tsx 참고)
 */
export const { Stack } = stackflow({
  config,
  components: {
    Landing: publicOnly(LandingActivity),
    Login: publicOnly(LoginActivity),
    // 이름이 아직 없는 유저가 들어오는 화면이라 withAuth로 감싸면 무한 리다이렉트한다.
    Onboarding: OnboardingActivity,
    Home: withAuth(HomeActivity),
    Subscribe: withAuth(SubscribeActivity),
    Analyze: withAuth(AnalyzeActivity),
    Expenses: withAuth(ExpensesActivity),
    SubscribeNewStart: withAuth(SubscribeNewStartActivity),
    SubscribeNew: withAuth(SubscribeNewActivity),
    SubscribeNewPay: withAuth(SubscribeNewPayActivity),
    SubscribeNewConfirm: withAuth(SubscribeNewConfirmActivity),
    SubscribeDetail: withAuth(SubscribeDetailActivity),
    SubscribeEdit: withAuth(SubscribeEditActivity),
  },
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({
      // 좌→우 슬라이드 + 왼쪽 엣지 스와이프백. 안드로이드 웹뷰에서도 어색하지 않다.
      theme: "cupertino",
      // AppScreen 기본 배경이 #fff라 다크 모드나 테마 변경 때 앱과 어긋난다.
      backgroundColor: "var(--color-background-surface)",
    }),
    historySyncPlugin({
      config,
      // 등록되지 않은 경로(/stats, /my 등)로 들어와도 흰 화면 대신 홈을 띄운다.
      fallbackActivity: () => "Home",
      useHash: false,
    }),
  ],
});
