import { useState } from "react";
import { TabBar } from "../../components/tab-bar";
import { TABS } from "../../constants/menus";
import { Border, Paragraph, IconButton } from "@toss/tds-mobile";
import { colors } from "@toss/tds-colors";
import SpendingSummary from "./spending-summary";
import EmptySubscription from "./empty-subscription";

function HomePage() {
  const [tab, setTab] = useState("home");

  return (
    <div>
      <div className="px-4 pt-2 flex justify-between">
        <Paragraph typography="t2" fontWeight="bold" display="block">
          <Paragraph.Text color={colors.blue500}>Gudocs</Paragraph.Text>
        </Paragraph>
        <IconButton
          src="https://static.toss.im/icons/svg/icon-alarm.svg"
          aria-label="알림 열기"
        />
      </div>
      <div className="p-4 pb-28 flex flex-col gap-2">
        <EmptySubscription />
        <Border variant="full" />
        <SpendingSummary />
      </div>
      <TabBar value={tab} onChange={setTab}>
        {TABS.map(({ value, label, icon }) => (
          <TabBar.Item key={value} value={value} label={label} icon={icon} />
        ))}
      </TabBar>
    </div>
  );
}

export default HomePage;
