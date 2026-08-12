import { useEffect, useRef, type ReactNode } from "react";
import { useActivity, useFlow, useStack } from "@stackflow/react";
import Fab from "../components/fab";
import { TabBar } from "../components/tab-bar";
import { ROOT_TAB, TABS, type TabActivity } from "../constants/menus";
import { HStack, IconButton, Icon, VStack } from "@astryxdesign/core";
import { AlarmIcon } from "./home/tab-icons";
import logo from "../assets/logo/logo.svg";

/** 탭 전환 뒤 최상단으로 올려야 할 화면. Stackflow가 이전 탭을 복원할 때도 유지한다. */
let pendingScrollTarget: TabActivity | null = null;

/**
 * 하단 탭이 붙는 화면들의 공통 껍데기.
 *
 * 스택 구조에서는 탭바를 감싸는 부모 화면이 따로 없다. 탭마다 독립 액티비티라
 * 각 액티비티가 자기 AppScreen 안에서 이 껍데기를 직접 렌더한다.
 */
function TabLayout({ children }: { children: ReactNode }) {
  const { push, pop, replace } = useFlow();
  const activity = useActivity();
  const stack = useStack();
  const scrollContainerRef = useRef<HTMLElement>(null);
  const topActivity = stack.activities[stack.activities.length - 1];
  const isTopActivity = topActivity?.id === activity.id;

  // 다른 탭에서 돌아오며 기존 액티비티가 복원되는 경우에도 탭 클릭 의도대로
  // 최상단을 보여준다. 상세 화면의 일반 뒤로가기는 pending 대상이 아니라 유지된다.
  useEffect(() => {
    if (!isTopActivity || pendingScrollTarget !== activity.name) return;

    pendingScrollTarget = null;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activity.name, isTopActivity]);

  const goTab = (target: TabActivity) => {
    pendingScrollTarget = target;

    if (target === activity.name) {
      pendingScrollTarget = null;
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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
      <VStack ref={scrollContainerRef} isScrollable className="flex-1">
        <HStack
          paddingInline={4}
          paddingBlock={2}
          justify="between"
          align="center"
        >
          {/*
            로고는 홈으로 가는 버튼이다. 이동은 탭 이동과 같은 규칙을 타야
            스택이 어긋나지 않으므로 goTab을 그대로 쓴다.
            (홈에서 누르면 goTab이 먼저 걸러내 아무 일도 일어나지 않는다.)
          */}
          <HStack
            as="button"
            aria-label="홈으로 이동"
            onClick={() => goTab(ROOT_TAB)}
            className="transition-transform active:scale-95"
          >
            <img src={logo} alt="" className="h-8 w-auto" />
          </HStack>
          {/* 여기서 권한을 직접 요청하지 않는다. 왜 필요한지 설명하는 알림 화면으로 보낸다. */}
          <IconButton
            label="알림 설정"
            icon={<Icon size="lg" icon={AlarmIcon} color="accent" />}
            variant="ghost"
            onClick={() => push("Notification", {})}
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
