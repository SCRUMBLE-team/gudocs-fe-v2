import { useState } from "react";

/**
 * 코치마크를 이미 본 적이 있는지 기억한다.
 *
 * 서버에 둘 만한 값이 아니고 기기마다 한 번씩 보여주면 충분해서 localStorage를 쓴다.
 * (푸시 쪽 gudocs.push.* 와 같은 방식)
 */
const STORAGE_KEY = "gudocs.expenses.chartCoachMark.v3";

function hasSeen(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    // 시크릿 모드 등에서 localStorage가 막혀 있으면 본 것으로 친다.
    // 매번 뜨는 것보다 안 뜨는 쪽이 덜 거슬린다.
    return true;
  }
}

export function useCoachMark() {
  // effect로 켜면 첫 페인트에 한 번 깜빡인다. 초기값에서 바로 결정한다.
  const [isVisible, setIsVisible] = useState(() => !hasSeen());

  const dismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // 저장이 안 되면 다음 방문에 한 번 더 뜨는 정도라 무시한다.
    }
  };

  return { isVisible, dismiss };
}
