import { useState } from "react";
import { TabBar } from "../../components/tab-bar";
import { HomeIcon, MyIcon, StatsIcon, SubscriptionIcon } from "./tab-icons";

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
