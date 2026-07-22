import {
  HomeIcon,
  SubscriptionIcon,
  StatsIcon,
  MyIcon,
} from "../routes/home/tab-icons";

// Astryx의 Icon은 엘리먼트가 아니라 SVG 컴포넌트를 받는다.
export const TABS = [
  { route: "/", label: "홈", icon: HomeIcon },
  { route: "/subscribe", label: "구독", icon: SubscriptionIcon },
  { route: "/stats", label: "통계", icon: StatsIcon },
  { route: "/my", label: "마이", icon: MyIcon },
] as const;
