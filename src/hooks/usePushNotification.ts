import { useCallback, useEffect, useState } from "react";
import {
  clearStoredRegistrationId,
  getPushPermission,
  hasAutoPrompted,
  markAutoPrompted,
  readStoredRegistrationId,
  requestPushRegistration,
  revokePushRegistration,
  type PushPermission,
} from "../lib/push";
import { useUnregisterPushMutation } from "./query/useUnregisterPushMutation";
import { useUserQuery } from "./query/useUserQuery";

/*
 * 자동 등록을 끝낸 유저. 훅 인스턴스가 아니라 모듈에 둔다.
 *
 * 이 훅은 TabLayout과 마이 화면에서 동시에 쓰인다. 인스턴스별 ref로 막으면
 * 마이 탭에서 두 인스턴스가 각자 한 번씩 register()를 부른다.
 */
let autoRegisteredUserId: number | null = null;

/**
 * 푸시 알림 권한을 관리한다.
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

  /**
   * 권한 요청 → FCM 등록 시작. 진행 상태는 건드리지 않는다.
   *
   * 자동 등록은 사용자가 기다리는 작업이 아니라서 버튼을 잠글 필요가 없다.
   * isPending을 여기서 세우면 이펙트가 렌더 직후 상태를 밀어 연쇄 렌더가 된다.
   */
  const runRegistration = useCallback(async () => {
    try {
      const ok = await requestPushRegistration();
      setPermission(getPushPermission());
      return ok;
    } catch (error) {
      // VAPID 키 불일치, SW 등록 실패 등이 여기로 온다.
      console.warn("[push] 알림을 켜지 못했어요", error);
      setPermission(getPushPermission());
      return false;
    }
  }, []);

  /** 벨 버튼용. 사용자가 기다리는 경로라 진행 상태를 세운다. */
  const enable = useCallback(async () => {
    setIsPending(true);
    try {
      return await runRegistration();
    } finally {
      setIsPending(false);
    }
  }, [runRegistration]);

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
      // 같은 유저가 다시 로그인하면 자동 등록이 다시 돌아야 한다.
      autoRegisteredUserId = null;
      return true;
    } catch (error) {
      console.warn("[push] 알림을 끄지 못했어요", error);
      return false;
    } finally {
      setIsPending(false);
    }
  }, [user, unregisterPush]);

  /*
   * 앱 진입 시 자동 등록. 로그인 상태에서 유저당 한 번만 돈다.
   *
   * 권한이 이미 granted여도 register()를 다시 부른다. SDK가 FID 등록을
   * 갱신해주고, 서버 반영은 onRegistered를 타고 push-bridge가 처리한다.
   *
   * 권한이 default면 여기서 프롬프트를 띄우되 기기당 1회로 제한한다.
   * 무시당한 프롬프트를 반복하면 브라우저가 영구 차단으로 처리한다.
   *
   * iOS Safari와 Firefox는 사용자 제스처 밖에서 온 requestPermission()을
   * 무시한다. 그 환경에서는 이 자동 요청이 조용히 실패하고, 벨 버튼이
   * 유일한 진입점으로 남는다.
   */
  useEffect(() => {
    if (!user) return;
    if (autoRegisteredUserId === user.id) return;

    const permissionNow = getPushPermission();
    if (permissionNow === "unsupported" || permissionNow === "denied") return;

    if (permissionNow !== "granted") {
      if (hasAutoPrompted()) return;
      markAutoPrompted();
    }

    autoRegisteredUserId = user.id;

    // queueMicrotask로 미루는 건 커밋이 끝난 뒤에 등록을 시작하기 위해서다.
    // 직접 호출하면 첫 await 전까지가 이펙트의 동기 구간에서 돌고, 이어지는
    // setState가 연쇄 렌더로 이어진다(react-hooks/set-state-in-effect).
    queueMicrotask(() => void runRegistration());
  }, [user, runRegistration]);

  return {
    /** 브라우저 알림 권한이 허용된 상태 */
    isEnabled: permission === "granted",
    permission,
    enable,
    disable,
    isPending,
  };
}
