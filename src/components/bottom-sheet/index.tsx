import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { VStack } from "@astryxdesign/core/VStack";
import { Heading } from "@astryxdesign/core/Heading";
import { useFocusTrap } from "@astryxdesign/core/hooks";

/**
 * TDS의 바텀시트.
 *
 * Astryx Dialog는 네이티브 <dialog>라 top layer로 올라가서 모바일 프레임을
 * 무시하고 뷰포트 전체를 덮는다. 원본 TDS 코드가 portalContainer로 #app-root에
 * 시트를 가뒀던 것과 같은 방식으로, 프레임 엘리먼트에 포털한다.
 *
 * Dialog를 안 쓰는 대신 포커스 트랩·Escape·열고 닫는 애니메이션은 직접 처리한다.
 * 닫힘 애니메이션을 끝까지 보여주려면 isOpen이 false가 된 뒤에도 잠시
 * 마운트를 유지해야 하므로, 표시 상태를 isMounted/isVisible로 나눈다.
 */
const FRAME_ID = "app-root";

/** --duration-medium-max(400ms)와 맞춘다. 이 값만 토큰과 어긋나지 않게 관리하면 된다. */
const TRANSITION_MS = 400;

export type BottomSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /** 시트 상단에 노출되는 제목 */
  title?: string;
  children: ReactNode;
};

function BottomSheet({
  isOpen,
  onOpenChange,
  title,
  children,
}: BottomSheetProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  const { containerRef, focusFirst } = useFocusTrap({
    isActive: isOpen,
    onEscape: () => onOpenChange(false),
  });

  // 1단계: 열리면 즉시 마운트하고, 닫히면 애니메이션이 끝난 뒤 언마운트한다.
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      return;
    }

    setIsVisible(false);
    const timer = setTimeout(() => setIsMounted(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // 2단계: 시트가 DOM에 올라온 뒤에 최종 위치로 전환한다.
  // 마운트와 같은 커밋에서 위치를 바꾸면 브라우저가 시작 상태를 못 봐서
  // 전환이 통째로 생략된다. 마운트 완료를 기다렸다가 다음 프레임에 바꾼다.
  useEffect(() => {
    if (!isMounted || !isOpen) {
      return;
    }

    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [isMounted, isOpen]);

  // 시트가 제자리에 도착한 뒤에 포커스를 옮긴다.
  // 아직 화면 아래(translate-y-full)일 때 포커스하면 브라우저가 그 요소를
  // 보이게 하려고 조상을 스크롤한다. #app-root는 overflow-hidden이어도
  // 스크립트 스크롤은 먹기 때문에 배경 전체가 밀려 올라간다.
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = setTimeout(focusFirst, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [isVisible, focusFirst]);

  if (!isMounted) {
    return null;
  }

  const frame = document.getElementById(FRAME_ID);
  if (!frame) {
    return null;
  }

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
        className={`absolute inset-0 z-40 bg-black/40 transition-opacity duration-(--duration-medium-max) ease-(--ease-standard) motion-reduce:transition-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
      <VStack
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        gap={2}
        paddingBlock={2}
        // Tailwind v4의 translate-y-* 는 transform이 아니라 translate 속성을
        // 설정하므로 transition-transform으로는 전환되지 않는다.
        className={`absolute inset-x-0 bottom-0 z-50 max-h-[70%] overflow-y-auto overscroll-contain rounded-t-3xl bg-surface transition-[translate] duration-(--duration-medium-max) ease-(--ease-standard) motion-reduce:transition-none ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* TDS 시트 상단의 그래버 */}
        <VStack align="center" aria-hidden="true" className="w-full shrink-0">
          <VStack className="h-1 w-9 rounded-full bg-border-strong" />
        </VStack>

        {/* 시트가 올라온 직후 내용이 살짝 늦게 따라 올라오며 나타난다.
            시트와 동시에 움직이면 한 덩어리로 보여서 깊이감이 없다.
            translate는 transform과 별개 속성이라 전환 목록에 따로 적는다. */}
        <VStack
          gap={2}
          className={`transition-[opacity,translate] delay-100 duration-(--duration-medium-max) ease-(--ease-standard) motion-reduce:transition-none motion-reduce:delay-0 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {title && (
            <VStack paddingInline={4} paddingBlock={1}>
              <Heading level={3}>{title}</Heading>
            </VStack>
          )}

          {children}
        </VStack>
      </VStack>
    </>,
    frame,
  );
}

export default BottomSheet;
