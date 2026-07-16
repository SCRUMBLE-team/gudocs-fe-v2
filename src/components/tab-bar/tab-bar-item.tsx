import type { ButtonHTMLAttributes, ReactNode } from "react";
import { colors } from "@toss/tds-colors";
import { useTabBarContext } from "./tab-bar-context";

export type TabBarItemProps = {
  /** TabBar의 value와 비교되는 탭 고유값 */
  value: string;
  /** 탭 아래 표시될 라벨 */
  label: string;
  /** 선택되지 않았을 때 보여줄 아이콘 (24x24 권장) */
  icon: ReactNode;
  /** 선택됐을 때 보여줄 아이콘. 생략하면 icon을 그대로 사용해요 */
  activeIcon?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onClick">;

export function TabBarItem({
  value,
  label,
  icon,
  activeIcon,
  className,
  ...props
}: TabBarItemProps) {
  const { value: activeValue, onChange } = useTabBarContext("TabBar.Item");
  const isActive = activeValue === value;

  return (
    <li role="presentation" className="flex flex-1 list-none justify-center">
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => onChange(value)}
        className={`flex w-full flex-col items-center gap-0.5 rounded-full py-1.5 transition-transform active:scale-95 ${className ?? ""}`}
        style={{
          color: isActive ? colors.blue700 : colors.grey400,
          outline: "none",
        }}
        {...props}
      >
        <span className="flex h-6 w-6 items-center justify-center [&>svg]:h-6 [&>svg]:w-6">
          {isActive ? (activeIcon ?? icon) : icon}
        </span>
        <span className="text-[11px] leading-none font-medium">{label}</span>
      </button>
    </li>
  );
}
