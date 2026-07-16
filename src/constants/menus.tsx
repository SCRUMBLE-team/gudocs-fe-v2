import {
  HomeIcon,
  SubscriptionIcon,
  StatsIcon,
  MyIcon,
} from "../routes/home/tab-icons";

export const TABS = [
  { value: "home", label: "홈", icon: <HomeIcon /> },
  { value: "subscriptions", label: "구독", icon: <SubscriptionIcon /> },
  { value: "stats", label: "통계", icon: <StatsIcon /> },
  { value: "my", label: "마이", icon: <MyIcon /> },
] as const;
