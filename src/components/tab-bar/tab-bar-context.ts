import { createContext, useContext } from "react";

export type TabBarContextValue = {
  value: string;
  onChange: (value: string) => void;
};

export const TabBarContext = createContext<TabBarContextValue | null>(null);

export function useTabBarContext(component: string) {
  const context = useContext(TabBarContext);

  if (!context) {
    throw new Error(`${component}는 TabBar 내부에서만 사용할 수 있어요.`);
  }

  return context;
}
