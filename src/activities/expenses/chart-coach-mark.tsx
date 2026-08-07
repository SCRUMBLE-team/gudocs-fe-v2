import type { SVGProps } from "react";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Text } from "@astryxdesign/core/Text";

/**
 * 첫 방문에 한 번만 뜨는 코치마크.
 *
 * 막대를 눌러야 월별 상세로 바뀐다는 걸 알려준다. 차트가 정적인 그림처럼 보여서
 * 탭할 수 있다는 신호가 없었다. 본 적이 있는지는 useCoachMark가 기억한다.
 */

// Astryx의 Icon은 size/color를 className·style로 내려보내므로
// 받은 props를 svg에 그대로 펼쳐야 크기가 적용된다.
function TapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* 검지로 누르는 손 */}
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 11V9.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11v-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-1.6-2.8a1.5 1.5 0 0 1 2.6-1.5L9 15.5V11" />
    </svg>
  );
}

/**
 * 차트 위에 겹쳐 띄우는 안내. 차트를 가리지 않게 위쪽에 붙이고 눌러서 닫을 수 있다.
 * 막대를 누르면 부모가 onDismiss를 호출한다.
 */
function ChartCoachMark({ onDismiss }: { onDismiss: () => void }) {
  return (
    <HStack
      as="button"
      aria-label="안내 닫기"
      onClick={onDismiss}
      gap={1.5}
      align="center"
      paddingInline={3}
      paddingBlock={1.5}
      className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-full bg-accent shadow-lg"
    >
      <Icon icon={TapIcon} size="sm" className="text-on-accent" />
      <Text type="supporting" weight="semibold" className="text-on-accent">
        탭해서 월별 상세보기
      </Text>
    </HStack>
  );
}

export default ChartCoachMark;
