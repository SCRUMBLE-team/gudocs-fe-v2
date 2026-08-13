import type { ComponentType, SVGProps } from "react";
import { VStack } from "@astryxdesign/core/VStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Text } from "@astryxdesign/core/Text";
import { useActivity } from "@stackflow/react";

export type TabBarItemProps = {
  /** 이 탭이 가리키는 액티비티 이름 */
  value: string;
  /** 탭 아래 표시될 라벨 */
  label: string;
  /** 선택되지 않았을 때 보여줄 아이콘 */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** 선택됐을 때 보여줄 아이콘. 생략하면 icon을 그대로 사용해요 */
  activeIcon?: ComponentType<SVGProps<SVGSVGElement>>;
  onClick: () => void;
};

export function TabBarItem({
  value,
  label,
  icon,
  activeIcon,
  onClick,
}: TabBarItemProps) {
  // 탭바를 그리는 액티비티가 곧 현재 탭이다.
  const isActive = useActivity().name === value;

  return (
    <VStack
      as="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      gap={0.5}
      paddingBlock={2}
      align="center"
      className="flex-1 transition-transform active:scale-95"
    >
      <Icon
        icon={isActive ? (activeIcon ?? icon) : icon}
        size="lg"
        color={isActive ? "accent" : "disabled"}
      />
      <Text type="label" size="2xs" color={isActive ? "accent" : "secondary"}>
        {label}
      </Text>
    </VStack>
  );
}
