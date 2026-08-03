import { useEffect } from "react";
import { onMessage, onRegistered, onUnregistered } from "firebase/messaging";
import { Text, VStack } from "@astryxdesign/core";
import { useToast } from "@astryxdesign/core/Toast";
import { getMessagingIfSupported } from "../lib/firebase";
import {
  clearStoredRegistrationId,
  readStoredRegistrationId,
  writeStoredRegistrationId,
} from "../lib/push";
import { getDeviceName } from "../utils/device";
import { useRegisterPushMutation } from "../hooks/query/useRegisterPushMutation";
import { useUnregisterPushMutation } from "../hooks/query/useUnregisterPushMutation";
import { useUserQuery } from "../hooks/query/useUserQuery";

/**
 * 푸시와 앱을 잇는 리스너들.
 *
 * 1. FID 등록/해제 → 서버 동기화. register()는 FID를 반환하지 않고
 *    onRegistered로 흘려보내므로, 서버에 올리는 건 여기서 한다. FCM이 FID를
 *    회전시켜도 같은 경로로 들어와 자동으로 맞춰진다.
 * 2. 포그라운드 수신 → 인앱 토스트. 브라우저는 탭이 활성일 때 알림을 자동
 *    표시하지 않아서, 이게 없으면 앱을 보고 있는 동안 온 알림은 사라진다.
 * 3. 알림 클릭 → 딥링크 이동. 서비스 워커가 보낸 PUSH_NAVIGATE를 받는다.
 *
 * App.tsx에 딱 한 번만 렌더한다. usePushNotification처럼 여러 화면에서 쓰면
 * 구독이 중복돼 FID 하나에 POST가 여러 번 나간다.
 *
 * useToast가 ToastViewport 아래에서만 동작해서 렌더 트리에 들어가야 한다.
 * 화면에 그리는 건 없고 리스너만 붙이는 컴포넌트다.
 */
function PushBridge() {
  const showToast = useToast();
  const { data: user } = useUserQuery();
  const { mutateAsync: registerPush } = useRegisterPushMutation();
  const { mutateAsync: unregisterPush } = useUnregisterPushMutation();

  useEffect(() => {
    if (!user) return;

    let unsubscribes: Array<() => void> = [];
    let isCancelled = false;

    void getMessagingIfSupported().then((messaging) => {
      if (!messaging || isCancelled) return;

      unsubscribes = [
        onRegistered(messaging, (fid) => {
          void registerPush({
            fid,
            platform: "WEB",
            deviceName: getDeviceName(),
          })
            .then((registration) =>
              writeStoredRegistrationId(user.id, registration.registrationId),
            )
            .catch((error: unknown) =>
              console.warn("[push] 기기 등록에 실패했어요", error),
            );
        }),

        onUnregistered(messaging, () => {
          // registrationId는 서버가 준 값이라 FID로는 못 찾는다. 저장해둔 걸 쓴다.
          const registrationId = readStoredRegistrationId(user.id);
          if (registrationId === null) return;

          void unregisterPush(registrationId)
            .then(() => clearStoredRegistrationId())
            .catch((error: unknown) =>
              console.warn("[push] 기기 해제에 실패했어요", error),
            );
        }),
      ];
    });

    return () => {
      isCancelled = true;
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [user, registerPush, unregisterPush]);

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
