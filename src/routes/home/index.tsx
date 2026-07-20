import { useState } from "react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { TabBar } from "../../components/tab-bar";
import { TABS } from "../../constants/menus";
// import SpendingSummary from "./spending-summary";
import EmptySubscription from "./empty-subscription";
import { AlarmIcon } from "./tab-icons";
import { useSubscriptionsQuery } from "../../hooks/query/useSubscriptionsQuery";

function HomePage() {
  const [tab, setTab] = useState("home");
  useSubscriptionsQuery({});

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
          <EmptySubscription />
          {/* <SpendingSummary /> */}
        </VStack>
      </VStack>

      <TabBar value={tab} onChange={setTab}>
        {TABS.map(({ value, label, icon }) => (
          <TabBar.Item key={value} value={value} label={label} icon={icon} />
        ))}
      </TabBar>
    </>
  );
}

export default HomePage;
