import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { Text, VStack } from "@astryxdesign/core";
import { useToast } from "@astryxdesign/core/Toast";
import { getMessagingIfSupported } from "../lib/firebase";

/**
 * 푸시와 앱 화면을 잇는 리스너 두 개.
 *
 * 1. 포그라운드 수신 → 인앱 토스트. 브라우저는 탭이 활성일 때 알림을 자동
 *    표시하지 않아서, 이게 없으면 앱을 보고 있는 동안 온 알림은 사라진다.
 * 2. 알림 클릭 → 딥링크 이동. 서비스 워커가 보낸 PUSH_NAVIGATE를 받는다.
 *
 * useToast가 ToastViewport 아래에서만 동작해서 렌더 트리에 들어가야 한다.
 * 화면에 그리는 건 없고 리스너만 붙이는 컴포넌트다.
 */
function PushBridge() {
  const showToast = useToast();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    // 언마운트가 구독보다 먼저 끝날 수 있어서(StrictMode) 플래그로 막는다.
    let isCancelled = false;

    void getMessagingIfSupported().then((messaging) => {
      if (!messaging || isCancelled) return;

      unsubscribe = onMessage(messaging, (payload) => {
        const title = payload.notification?.title ?? payload.data?.title;
        const body = payload.notification?.body ?? payload.data?.body;
        if (!title && !body) return;

        showToast({
          body: (
            <VStack gap={1}>
              {title && <Text weight="bold">{title}</Text>}
              {body && <Text>{body}</Text>}
            </VStack>
          ),
          isAutoHide: true,
          autoHideDuration: 5000,
        });
      });
    });

    return () => {
      isCancelled = true;
      unsubscribe?.();
    };
  }, [showToast]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "PUSH_NAVIGATE" || !event.data.link) return;

      // historySyncPlugin이 URL을 읽어 스택을 복원해준다. 전체 로드라 기존
      // 스택은 초기화되지만, URL→액티비티 매칭을 손으로 다시 짜서
      // stackflow.config.ts와 드리프트를 만드는 것보다 낫다. 알림 클릭은
      // 대개 앱이 백그라운드일 때라 재로드가 눈에 띄지도 않는다.
      window.location.assign(event.data.link);
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () =>
      navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

export default PushBridge;
