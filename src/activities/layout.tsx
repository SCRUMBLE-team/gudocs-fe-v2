import type { ReactNode } from "react";
import { useActivity, useFlow } from "@stackflow/react";
import Fab from "../components/fab";
import { TabBar } from "../components/tab-bar";
import { ROOT_TAB, TABS, type TabActivity } from "../constants/menus";
import { HStack, IconButton, Text, Icon, VStack } from "@astryxdesign/core";
import { AlarmIcon } from "./home/tab-icons";

/**
 * 하단 탭이 붙는 화면들의 공통 껍데기.
 *
 * 스택 구조에서는 탭바를 감싸는 부모 화면이 따로 없다. 탭마다 독립 액티비티라
 * 각 액티비티가 자기 AppScreen 안에서 이 껍데기를 직접 렌더한다.
 */
function TabLayout({ children }: { children: ReactNode }) {
  const { push, pop, replace } = useFlow();
  const activity = useActivity();

  const goTab = (target: TabActivity) => {
    if (target === activity.name) return;

    if (target === ROOT_TAB) {
      if (activity.isRoot) replace(ROOT_TAB, {}, { animate: false });
      else pop({ animate: false });
      return;
    }

    if (activity.name === ROOT_TAB) push(target, {}, { animate: false });
    else replace(target, {}, { animate: false });
  };

  return (
    <VStack height="100%">
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
        {children}
      </VStack>
      <Fab onClick={() => push("SubscribeNew", {})} />
      <TabBar>
        {TABS.map(({ activity: target, label, icon }) => (
          <TabBar.Item
            value={target}
            onClick={() => goTab(target)}
            key={label}
            label={label}
            icon={icon}
          />
        ))}
      </TabBar>
    </VStack>
  );
}

export default TabLayout;
