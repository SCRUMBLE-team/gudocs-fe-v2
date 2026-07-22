import { Outlet, useNavigate } from "react-router-dom";
import Fab from "../components/fab";
import { TabBar } from "../components/tab-bar";
import { TABS } from "../constants/menus";
import { HStack, IconButton, Text, Icon, VStack } from "@astryxdesign/core";
import { AlarmIcon } from "./home/tab-icons";

function Layout() {
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
        <Outlet />
      </VStack>
      <Fab onClick={() => navigate("/subscribe/new")} />
      <TabBar>
        {TABS.map(({ route, label, icon }) => (
          <TabBar.Item
            value={route}
            onClick={() => navigate(route)}
            key={label}
            label={label}
            icon={icon}
          />
        ))}
      </TabBar>
    </>
  );
}

export default Layout;
