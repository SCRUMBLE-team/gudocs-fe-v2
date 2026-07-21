import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { TabBar } from "../../components/tab-bar";
import { TABS } from "../../constants/menus";
import Fab from "../../components/fab";
import SpendingSummary from "./spending-summary";
import { AlarmIcon } from "./tab-icons";
import SubscriptionCard from "./subscription-card";
import AnalyzeExpenses from "./analyze-expenses";

function HomePage() {
  const [tab, setTab] = useState("home");
  const navigate = useNavigate();

  return (
    <>
      <VStack isScrollable className="flex-1">
        <HStack
          paddingInline={4}
          paddingBlock={2}
          justify="between"
          align="center"
        >
          <Text className="text-2xl" weight="bold" color="accent">
            Gudocs
          </Text>
          <IconButton
            label="알림 열기"
            icon={<Icon size="lg" icon={AlarmIcon} />}
            variant="ghost"
          />
        </HStack>

        <VStack padding={4} gap={3}>
          <Suspense>
            <SubscriptionCard />
          </Suspense>
          <Suspense>
            <SpendingSummary />
          </Suspense>
          <Suspense>
            <AnalyzeExpenses />
          </Suspense>
        </VStack>
      </VStack>

      <Fab onClick={() => navigate("/subscribe/new")} />

      <TabBar value={tab} onChange={setTab}>
        {TABS.map(({ value, label, icon }) => (
          <TabBar.Item key={value} value={value} label={label} icon={icon} />
        ))}
      </TabBar>
    </>
  );
}

export default HomePage;
