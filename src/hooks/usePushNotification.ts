import { useCallback, useEffect, useState } from "react";
import {
  clearStoredRegistrationId,
  getPushPermission,
  readStoredRegistrationId,
  requestPushRegistration,
  revokePushRegistration,
  type PushPermission,
} from "../lib/push";
import { useUnregisterPushMutation } from "./query/useUnregisterPushMutation";
import { useUserQuery } from "./query/useUserQuery";

/**
 * 푸시 알림 권한을 관리한다.
 *
 * 자동 등록은 하지 않는다. 권한 요청은 알림 화면(activities/notification)의
 * 버튼에서만 시작한다 — 맥락 없이 뜬 프롬프트는 거절당하기 쉽고, 한번 거절되면
 * 코드로 다시 띄울 방법이 없다.
 *
 * FID를 서버에 올리는 건 여기가 아니라 components/push-bridge.tsx다.
 * register()는 등록을 시작만 하고 FID는 onRegistered 콜백으로 오기 때문에,
 * 화면마다 붙는 이 훅에서 받으면 구독이 중복된다.
 */
export function usePushNotification() {
  const { data: user } = useUserQuery();
  const { mutateAsync: unregisterPush } = useUnregisterPushMutation();

  const [permission, setPermission] =
    useState<PushPermission>(getPushPermission);
  const [isPending, setIsPending] = useState(false);

  /*
   * 브라우저 설정에서 권한을 바꾸고 돌아오는 경로를 따라간다.
   *
   * 차단 상태를 풀려면 앱을 떠나 설정을 만져야 하는데, 그동안 알림 화면은
   * 스택에 그대로 살아 있어서 초기값이 낡은 채로 남는다. 돌아왔을 때 여전히
   * "차단돼 있어요"가 떠 있으면 사용자는 자기가 뭘 잘못했다고 생각한다.
   */
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setPermission(getPushPermission());
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  /** 알림 화면의 CTA용. 사용자가 기다리는 경로라 진행 상태를 세운다. */
  const enable = useCallback(async () => {
    setIsPending(true);
    try {
      return await requestPushRegistration();
    } catch (error) {
      // VAPID 키 불일치, SW 등록 실패 등이 여기로 온다.
      console.warn("[push] 알림을 켜지 못했어요", error);
      return false;
    } finally {
      // 성공이든 실패든 프롬프트 결과가 권한에 반영됐을 수 있다.
      setPermission(getPushPermission());
      setIsPending(false);
    }
  }, []);

  /**
   * 로그아웃용. 서버 등록을 지우고 이 기기의 FID 등록도 해제한다.
   *
   * 서버 DELETE를 직접 부르는 건 순서 때문이다. revokePushRegistration()이
   * 발화시키는 onUnregistered는 비동기라, 그것만 믿으면 로그아웃 요청이
   * 먼저 나가 401로 실패한다. DELETE는 멱등이라 콜백이 뒤늦게 한 번 더
   * 불러도 문제없다.
   */
  const disable = useCallback(async () => {
    if (!user) return false;

    setIsPending(true);
    try {
      const registrationId = readStoredRegistrationId(user.id);
      if (registrationId !== null) await unregisterPush(registrationId);

      await revokePushRegistration();
      clearStoredRegistrationId();
      return true;
    } catch (error) {
      console.warn("[push] 알림을 끄지 못했어요", error);
      return false;
    } finally {
      setIsPending(false);
    }
  }, [user, unregisterPush]);

  return {
    /** 브라우저 알림 권한이 허용된 상태 */
    isEnabled: permission === "granted",
    permission,
    enable,
    disable,
    isPending,
  };
}
