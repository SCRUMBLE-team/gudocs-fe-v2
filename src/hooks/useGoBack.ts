import { useActivity, useFlow } from "@stackflow/react";

/**
 * 헤더 뒤로가기 버튼용 이동 함수.
 *
 * pop()만 쓰면 이 화면이 스택 바닥일 때 되돌아갈 곳이 없어 아무 일도 일어나지
 * 않는다. 주소로 바로 열었거나 새로고침한 경우가 그렇다 — 개발 중에는 물론이고,
 * 푸시 알림으로 특정 화면에 바로 들어오는 경로도 있어서 실제로 자주 생긴다.
 * 그때는 홈으로 갈아끼워 사용자가 갇히지 않게 한다.
 *
 * 탭 이동(activities/layout.tsx의 goTab)도 같은 판단을 한다.
 */
export function useGoBack() {
  const { pop, replace } = useFlow();
  const activity = useActivity();

  return () => {
    if (activity.isRoot) replace("Home", {}, { animate: false });
    else pop();
  };
}
