import { useEffect, useRef, useState } from "react";

/** 끝에서 부드럽게 감속하는 곡선. 숫자가 목표에 '내려앉는' 느낌을 준다. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/**
 * target이 바뀔 때 현재 표시값에서 새 목표까지 숫자를 굴려준다.
 *
 * 애니메이션 라이브러리가 없어서 rAF로 직접 돌린다. 중간에 target이 또 바뀌어도
 * 0부터 다시 세지 않고 지금 보이는 값에서 이어가므로 연속으로 체크해도 끊기지 않는다.
 * 화면에 그릴 값이라 정수로 반올림해서 내보낸다.
 */
export function useCountUp(target: number, duration = 400): number {
  // 접근성 설정은 세션 중에 바뀌는 일이 거의 없어서 마운트 때 한 번만 읽는다.
  const [isReduced] = useState(prefersReducedMotion);
  const [value, setValue] = useState(target);
  // 애니메이션 도중의 값을 state와 별개로 들고 있는다. 다음 애니메이션의 출발점이다.
  const currentRef = useRef(target);
  const frameRef = useRef<number | null>(null);

  const isAnimated = !isReduced && duration > 0;

  useEffect(() => {
    if (!isAnimated) return;

    const from = currentRef.current;
    if (from === target) return;

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = from + (target - from) * easeOutCubic(progress);
      currentRef.current = next;
      setValue(Math.round(next));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        currentRef.current = target;
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [target, duration, isAnimated]);

  // 애니메이션을 끄는 경우 이펙트에서 setState 하는 대신 목표값을 그대로 돌려준다.
  return isAnimated ? value : target;
}

export default useCountUp;
