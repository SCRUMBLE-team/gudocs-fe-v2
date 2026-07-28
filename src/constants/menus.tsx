import { HomeIcon, SubscriptionIcon } from "../activities/home/tab-icons";

/**
 * 하단 탭 목록.
 *
 * value가 경로가 아니라 액티비티 이름이다. stackflow.config.ts에 등록되지 않은
 * 이름을 넣으면 TabLayout의 이동 함수에서 타입 에러로 걸린다.
 * 통계(StatsIcon)·마이(MyIcon) 탭은 대응 화면이 아직 없어서 — 전에는 눌러도
 * 매칭되는 라우트가 없어 빈 화면이 떴다 — 화면이 생길 때까지 목록에서 뺀다.
 */

// Astryx의 Icon은 엘리먼트가 아니라 SVG 컴포넌트를 받는다.
export const TABS = [
  { activity: "Home", label: "홈", icon: HomeIcon },
  { activity: "Subscribe", label: "구독", icon: SubscriptionIcon },
] as const;

export type TabActivity = (typeof TABS)[number]["activity"];

/**
 * 스택 바닥에 두는 탭.
 *
 * 탭 이동은 이 탭을 기준으로 쌓고 되돌린다(TabLayout의 goTab 참고).
 * 목록의 첫 탭과 일치해야 한다.
 */
export const ROOT_TAB = TABS[0].activity;
