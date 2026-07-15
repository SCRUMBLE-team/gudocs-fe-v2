import { TabBarRoot } from "./tab-bar-root";
import { TabBarItem } from "./tab-bar-item";

export const TabBar = Object.assign(TabBarRoot, { Item: TabBarItem });

export type { TabBarProps } from "./tab-bar-root";
export type { TabBarItemProps } from "./tab-bar-item";
