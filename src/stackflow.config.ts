import { defineConfig } from "@stackflow/config";
import type { SubscribeConfirmParams } from "./activities/subscribe/new/to-subscribe-draft";
import type { SubscribeCategory } from "./types/subscribe";

/**
 * 화면 스택 정의. route는 historySyncPlugin이 URL과 짝지을 때 쓴다.
 *
 * 경로 매칭 우선순위는 선언 순서가 아니라 plugin-history-sync의
 * sortActivityRoutes가 계산하는 specificity 점수로 정해진다.
 * (정적 세그먼트 10점 > 동적 세그먼트 3점) 그래서 /subscribe/new가
 * /subscribe/:id보다 먼저 매칭된다. 아래 순서는 읽기 편하라고 맞춰둔 것뿐이다.
 */
export const config = defineConfig({
  activities: [
    { name: "Landing", route: "/landing" },
    { name: "Login", route: "/login" },
    { name: "Onboarding", route: "/onboarding" },
    { name: "Home", route: "/" },
    { name: "Subscribe", route: "/subscribe" },
    { name: "Analyze", route: "/analyze" },
    { name: "Expenses", route: "/expenses" },
    { name: "Savings", route: "/savings" },
    { name: "SubscribeNewStart", route: "/subscribe/new" },
    { name: "SubscribeNew", route: "/subscribe/new/service" },
    { name: "SubscribeNewPay", route: "/subscribe/new/pay" },
    { name: "SubscribeNewConfirm", route: "/subscribe/new/confirm" },
    { name: "SubscribeDetail", route: "/subscribe/:id" },
    { name: "SubscribeEdit", route: "/subscribe/:id/edit" },
  ],
  transitionDuration: 350,
});

declare module "@stackflow/config" {
  interface Register {
    Landing: Record<string, never>;
    Login: Record<string, never>;
    Onboarding: Record<string, never>;
    Home: Record<string, never>;
    Subscribe: { tab?: "일정" | "목록" };
    Analyze: Record<string, never>;
    Expenses: Record<string, never>;
    Savings: Record<string, never>;
    SubscribeNewStart: Record<string, never>;
    SubscribeNew: Record<string, never>;
    SubscribeNewPay: { category: SubscribeCategory; service: string };
    // historySync가 URL에 실었다 새로고침 때 문자열로 복원하므로 price도 string이다.
    // 파싱·검증은 받는 쪽 toSubscribeDraft가 맡는다.
    SubscribeNewConfirm: SubscribeConfirmParams;
    SubscribeDetail: { id: string };
    SubscribeEdit: { id: string };
  }
}
