import type { ReactNode } from "react";
import { HStack } from "@astryxdesign/core/HStack";
import { TabBarContext } from "./tab-bar-context";

/**
 * 하단 고정 탭바. Astryx에는 모바일 하단 탭바 대응 컴포넌트가 없어서
 * HStack + Icon + Text 프리미티브로 직접 구성한다.
 * 탭 개수는 최소 2개, 최대 5개를 권장한다.
 */
export type TabBarProps = {
  /** 현재 선택된 TabBar.Item의 value */
  value: string;
  /** 선택된 탭이 바뀔 때 호출돼요 */
  onChange: (value: string) => void;
  /** 2개 이상 5개 이하의 TabBar.Item을 전달해주세요 */
  children: ReactNode;
};

export function TabBarRoot({ value, onChange, children }: TabBarProps) {
  return (
    <TabBarContext.Provider value={{ value, onChange }}>
      <HStack
        as="nav"
        role="tablist"
        aria-label="하단 탭 메뉴"
        paddingInline={3}
        align="center"
        className="sticky bottom-0 z-50 border-t border-gray-300 rounded-t-lg bg-surface"
      >
        {children}
      </HStack>
    </TabBarContext.Provider>
  );
}
