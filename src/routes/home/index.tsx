import { useState } from "react";
import { TabBar } from "../../components/tab-bar";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path
        d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SubscriptionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M4 10h16M8 3v3M16 3v3" strokeLinecap="round" />
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path
        d="M5 19V10M12 19V5M19 19v-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5.5 7-5.5s5.8 2 7 5.5" strokeLinecap="round" />
    </svg>
  );
}

const TABS = [
  { value: "home", label: "홈", icon: <HomeIcon /> },
  { value: "subscriptions", label: "구독", icon: <SubscriptionIcon /> },
  { value: "stats", label: "통계", icon: <StatsIcon /> },
  { value: "my", label: "마이", icon: <MyIcon /> },
];

function HomePage() {
  const [tab, setTab] = useState("home");

  return (
    <div className="min-h-dvh pb-24">
      <p className="p-4">home</p>

      <TabBar value={tab} onChange={setTab}>
        {TABS.map(({ value, label, icon }) => (
          <TabBar.Item key={value} value={value} label={label} icon={icon} />
        ))}
      </TabBar>
    </div>
  );
}

export default HomePage;
