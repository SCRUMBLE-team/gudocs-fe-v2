import type { SVGProps } from "react";
import { HStack } from "@astryxdesign/core/HStack";

// Astryx 시맨틱 아이콘에는 plus가 없어 커스텀 SVG로 그린다.
// 받은 props를 svg에 펼쳐 크기/색(currentColor)이 적용되게 한다.
function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      {...props}
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export type FabProps = {
  onClick: () => void;
  /** 스크린리더용 라벨 */
  label?: string;
};

/**
 * 우하단 플로팅 액션 버튼.
 *
 * #app-root(relative, 최대 480px)를 기준으로 absolute 배치돼 스크롤과 무관하게
 * 항상 노출된다. 하단 TabBar(약 56px) 위를 비우도록 bottom-20으로 띄운다.
 * 홈·구독 탭 등 TabBar가 있는 화면에서 공용으로 재사용한다.
 */
function Fab({ onClick, label = "구독 추가" }: FabProps) {
  return (
    <HStack
      as="button"
      onClick={onClick}
      aria-label={label}
      align="center"
      justify="center"
      className="absolute bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-[var(--color-background-blue)] text-[var(--color-text-blue)] shadow-xl transition-transform active:scale-95"
    >
      <PlusIcon className="h-7 w-7" />
    </HStack>
  );
}

export default Fab;
