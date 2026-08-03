import type { ReactNode } from "react";
import { useActivity, useFlow } from "@stackflow/react";
import Fab from "../components/fab";
import { TabBar } from "../components/tab-bar";
import { ROOT_TAB, TABS, type TabActivity } from "../constants/menus";
import { HStack, IconButton, Text, Icon, VStack } from "@astryxdesign/core";
import { useToast } from "@astryxdesign/core/Toast";
import { usePushNotification } from "../hooks/usePushNotification";
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
  const showToast = useToast();
  const { isEnabled, permission, enable, isPending } = usePushNotification();

  /**
   * 벨 버튼은 알림을 "켜는" 경로만 담당한다. 끄는 건 마이 탭의 로그아웃뿐이다.
   *
   * 앱 진입 시 자동으로 권한을 요청하는데도 이 버튼이 필요한 건 iOS Safari와
   * Firefox 때문이다. 둘은 requestPermission()을 사용자 제스처 안에서만
   * 받아주므로 자동 요청이 조용히 무시된다. 그 환경에선 여기가 유일한 진입점이다.
   */
  async function handleAlarmClick() {
    if (permission === "unsupported") {
      showToast({
        body: "이 브라우저는 알림을 지원하지 않아요. 홈 화면에 추가하면 받을 수 있어요.",
        isAutoHide: true,
        autoHideDuration: 4000,
      });
      return;
    }

    // 한 번 차단하면 프롬프트를 다시 띄울 방법이 없다. 설정으로 안내한다.
    if (permission === "denied") {
      showToast({
        body: "알림이 차단돼 있어요. 브라우저 설정에서 허용해주세요.",
        isAutoHide: true,
        autoHideDuration: 4000,
      });
      return;
    }

    if (isEnabled) {
      showToast({
        body: "알림이 켜져 있어요",
        isAutoHide: true,
        autoHideDuration: 2000,
      });
      return;
    }

    const ok = await enable();
    showToast({
      body: ok ? "알림을 켰어요" : "알림을 켜지 못했어요",
      type: ok ? "info" : "error",
      isAutoHide: true,
      autoHideDuration: 3000,
    });
  }

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
            label={isEnabled ? "알림 끄기" : "알림 켜기"}
            icon={
              <Icon
                size="lg"
                icon={AlarmIcon}
                color={isEnabled ? "accent" : undefined}
              />
            }
            variant="ghost"
            isDisabled={isPending}
            onClick={handleAlarmClick}
          />
        </HStack>
        {children}
      </VStack>
      <Fab onClick={() => push("SubscribeNewStart", {})} />
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
