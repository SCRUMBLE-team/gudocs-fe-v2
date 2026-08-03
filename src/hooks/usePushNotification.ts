import { useCallback, useEffect, useState } from "react";
import {
  clearStoredRegistrationId,
  getPushPermission,
  hasAutoPrompted,
  markAutoPrompted,
  readStoredRegistrationId,
  requestPushRegistration,
  revokePushToken,
  writeStoredRegistrationId,
  type PushPermission,
} from "../lib/push";
import { getDeviceName } from "../utils/device";
import { useRegisterPushMutation } from "./query/useRegisterPushMutation";
import { useUnregisterPushMutation } from "./query/useUnregisterPushMutation";
import { useUserQuery } from "./query/useUserQuery";

/*
 * 자동 등록을 끝낸 유저. 훅 인스턴스가 아니라 모듈에 둔다.
 *
 * 이 훅은 TabLayout과 마이 화면에서 동시에 쓰인다. 인스턴스별 ref로 막으면
 * 마이 탭에서 두 인스턴스가 각자 한 번씩 돌아 같은 POST가 두 번 나간다.
 */
let autoRegisteredUserId: number | null = null;

/**
 * 푸시 알림 등록 상태를 관리한다.
 *
 * "켜짐" 판단에 브라우저 권한만 쓰면 안 된다. 로그아웃으로 서버 등록을 지워도
 * 브라우저 권한은 granted로 남아서 켜진 것처럼 보인다. 그래서 서버가 준
 * registrationId를 로컬에 두고 그 존재 여부를 함께 본다.
 */
export function usePushNotification() {
  const { data: user } = useUserQuery();
  const { mutateAsync: registerPush } = useRegisterPushMutation();
  const { mutateAsync: unregisterPush } = useUnregisterPushMutation();

  const [permission, setPermission] =
    useState<PushPermission>(getPushPermission);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [trackedUserId, setTrackedUserId] = useState<number | null>(null);
  const [isPending, setIsPending] = useState(false);

  // 계정이 바뀌면(로그인·로그아웃 포함) 저장된 등록 정보를 다시 읽는다.
  // 이펙트로 하면 잘못된 상태로 한 번 렌더된 뒤 고쳐져서 벨이 깜빡인다.
  // 렌더 중 조정은 React가 권장하는 파생 상태 패턴이다.
  const currentUserId = user?.id ?? null;
  if (currentUserId !== trackedUserId) {
    setTrackedUserId(currentUserId);
    setRegistrationId(
      currentUserId === null ? null : readStoredRegistrationId(currentUserId),
    );
  }

  /**
   * 권한 요청 → FID → 서버 등록. 진행 상태는 건드리지 않는다.
   *
   * 자동 등록은 사용자가 기다리는 작업이 아니라서 버튼을 잠글 필요가 없다.
   * isPending을 여기서 세우면 이펙트가 렌더 직후 상태를 밀어 연쇄 렌더가 된다.
   */
  const runRegistration = useCallback(async () => {
    if (!user) return false;

    try {
      const fid = await requestPushRegistration();
      setPermission(getPushPermission());
      if (!fid) return false;

      const registration = await registerPush({
        fid,
        platform: "WEB",
        deviceName: getDeviceName(),
      });

      writeStoredRegistrationId(user.id, registration.registrationId);
      setRegistrationId(registration.registrationId);
      return true;
    } catch (error) {
      // 권한 거부, VAPID 키 불일치, SW 등록 실패, 서버 4xx/5xx가 여기로 온다.
      console.warn("[push] 알림을 켜지 못했어요", error);
      setPermission(getPushPermission());
      return false;
    }
  }, [registerPush, user]);

  /** 벨 버튼용. 사용자가 기다리는 경로라 진행 상태를 세운다. */
  const enable = useCallback(async () => {
    setIsPending(true);
    try {
      return await runRegistration();
    } finally {
      setIsPending(false);
    }
  }, [runRegistration]);

  const disable = useCallback(async () => {
    if (registrationId === null) return false;

    setIsPending(true);
    try {
      await unregisterPush(registrationId);
      // 서버 해제가 성공한 뒤에 지운다. 먼저 지우면 실패 시 registrationId를
      // 잃어버려서 다시 끌 방법이 없어진다.
      await revokePushToken();
      clearStoredRegistrationId();
      setRegistrationId(null);
      // 같은 유저가 다시 로그인하면 자동 등록이 다시 돌아야 한다.
      autoRegisteredUserId = null;
      return true;
    } catch (error) {
      console.warn("[push] 알림을 끄지 못했어요", error);
      return false;
    } finally {
      setIsPending(false);
    }
  }, [registrationId, unregisterPush]);

  /*
   * 앱 진입 시 자동 등록. 로그인 상태에서 유저당 한 번만 돈다.
   *
   * 권한이 이미 granted면 저장된 등록 유무와 무관하게 등록한다. 사용자가
   * 알림을 끄는 수단은 로그아웃뿐이라 "직접 껐으니 되살리지 말자"고 판단할
   * 근거가 없다. 오히려 같은 기기에서 계정을 바꾼 경우 — 앞 사용자가
   * 로그아웃하며 저장값을 지웠지만 브라우저 권한은 granted로 남는다 —
   * 저장값을 조건으로 걸면 새 사용자가 영영 등록되지 않는다.
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

    // upsert라 enabled=true와 updatedAt이 갱신된다. FID는 앱 데이터 삭제나
    // 장기 미사용으로 회전되므로 매 세션 맞춰둔다.
    //
    // queueMicrotask로 미루는 건 커밋이 끝난 뒤에 등록을 시작하기 위해서다.
    // 직접 호출하면 첫 await 전까지가 이펙트의 동기 구간에서 돌고, 이어지는
    // setState가 연쇄 렌더로 이어진다(react-hooks/set-state-in-effect).
    queueMicrotask(() => void runRegistration());
  }, [user, runRegistration]);

  return {
    /** 서버 등록이 살아 있고 브라우저 권한도 있는 상태 */
    isEnabled: registrationId !== null && permission === "granted",
    permission,
    enable,
    disable,
    isPending,
  };
}
