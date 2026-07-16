import type { ReactNode } from "react";
import { TabBarContext } from "./tab-bar-context";

/**
 * 토스 미니앱 UI/UX 가이드: 탭바는 필수 컴포넌트가 아니지만, 사용한다면 토스가 제공하는
 * 플로팅 형태를 그대로 유지해야 해요. (기본 하단 탭과 겹치면 사용자가 현재 위치를 혼동할 수 있어요.)
 * 탭 개수는 최소 2개, 최대 5개를 권장해요.
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
      <nav
        aria-label="하단 탭 메뉴"
        className="bg-white fixed inset-x-0 bottom-0 z-50 flex justify-center"
      >
        <ul
          role="tablist"
          className="flex w-full max-w-120 items-center justify-between rounded-t-3xl  px-3 pt-2 border-t-2 border-x-2 border-blue-50"
        >
          {children}
        </ul>
      </nav>
    </TabBarContext.Provider>
  );
}
