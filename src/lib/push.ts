import { register, unregister } from "firebase/messaging";
import { firebaseConfig, getMessagingIfSupported } from "./firebase";

const FCM_SW_URL = "/firebase-messaging-sw.js";

/**
 * FCM 전용 서비스 워커 스코프.
 *
 * 서비스 워커 등록은 스코프 단위로 유일하다. "/"에 등록하면 vite-plugin-pwa가
 * 올려둔 워크박스 SW 등록을 교체해버려서 PWA 캐싱이 죽는다. 실제 라우트일
 * 필요는 없고, 루트에서 서빙되는 스크립트라 하위 스코프는 자유롭게 주장할 수
 * 있다(Service-Worker-Allowed 헤더 불필요).
 */
const FCM_SW_SCOPE = "/firebase-cloud-messaging-push-scope";

export type PushPermission = NotificationPermission | "unsupported";

/**
 * FCM 전용 SW를 직접 등록한다.
 *
 * SDK에 맡기면 쿼리스트링 없이 등록해버려서 SW가 Firebase config를 못 읽는다.
 * 그래서 여기서 등록하고 그 registration을 register()에 넘긴다.
 */
async function registerFcmServiceWorker() {
  const params = new URLSearchParams(firebaseConfig);
  return navigator.serviceWorker.register(`${FCM_SW_URL}?${params}`, {
    scope: FCM_SW_SCOPE,
  });
}

/** 현재 알림 권한. Notification API 자체가 없는 환경은 "unsupported". */
export function getPushPermission(): PushPermission {
  if (typeof Notification === "undefined") return "unsupported";
  return Notification.permission;
}

/**
 * 권한을 받고 이 기기를 FCM에 등록한다. 성공하면 true.
 *
 * FID는 여기서 돌려주지 않는다. register()는 등록을 시작만 하고 FID는
 * onRegistered 콜백으로 온다 — 구독은 components/push-bridge.tsx가 맡는다.
 * Installations의 getId()로 직접 뽑으면 안 된다. 그건 FCM 등록 성공 여부와
 * 무관하게 값을 주기 때문에, 배달되지 않는 FID를 서버에 심게 된다.
 *
 * iOS Safari는 requestPermission()을 사용자 제스처 핸들러 안에서 호출해야
 * 프롬프트가 뜬다. 권한이 아직 "default"일 때는 반드시 클릭에서 호출할 것.
 */
export async function requestPushRegistration() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) {
    // 실패 지점을 남긴다. 배포 빌드에서 알림이 안 오는 이유가 미지원 환경인지
    // 권한 거부인지 구분이 안 되면 원인을 찾을 수가 없다.
    console.warn(
      "[push] 이 환경에서는 FCM을 쓸 수 없어요. HTTPS(또는 localhost)인지, iOS라면 홈 화면에 설치했는지 확인하세요.",
    );
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn(`[push] 알림 권한이 "${permission}" 상태예요.`);
    return false;
  }

  const serviceWorkerRegistration = await registerFcmServiceWorker();
  await register(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });

  return true;
}

/**
 * 이 기기의 FID 등록을 지운다. 성공하면 onUnregistered가 발화한다.
 * 로그아웃에서 서버 해제와 같이 부른다.
 */
export async function revokePushRegistration() {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return;
  await unregister(messaging);
}

/*
 * registrationId 로컬 보관.
 *
 * DELETE /api/push-registrations/{registrationId}에 필요하고 새로고침을
 * 넘겨야 해서 localStorage에 둔다. userId를 함께 저장하는 게 핵심이다 —
 * 같은 기기에서 계정이 바뀌면 남의 registrationId로 DELETE를 쳐서 403이 난다.
 *
 * Safari 프라이빗 모드는 localStorage 접근 자체가 throw할 수 있어 전부 감싼다.
 */
const STORAGE_KEY = "gudocs.push.registration";

interface StoredRegistration {
  userId: number;
  registrationId: number;
}

export function readStoredRegistrationId(userId: number): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredRegistration;
    // 다른 계정이 남긴 값이면 없는 것으로 친다.
    return stored.userId === userId ? stored.registrationId : null;
  } catch {
    return null;
  }
}

export function writeStoredRegistrationId(
  userId: number,
  registrationId: number,
) {
  try {
    const stored: StoredRegistration = { userId, registrationId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // 저장에 실패하면 다음 접속에 다시 켜야 하는 정도의 불편이라 삼킨다.
  }
}

export function clearStoredRegistrationId() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 위와 같다.
  }
}

/*
 * 앱 진입 시 자동 권한 요청을 이미 했는지.
 *
 * 사용자가 프롬프트를 "무시"하면 권한이 default로 남아서 진입할 때마다 다시
 * 뜬다. Chrome은 이걸 3회 반복하면 사이트를 영구 차단해버리므로 자동 요청은
 * 기기당 한 번만 한다. 이후에는 벨 버튼(명시적 제스처)으로만 다시 물어본다.
 *
 * 권한 자체가 오리진 단위라 유저별로 나누지 않는다.
 */
const AUTO_PROMPT_KEY = "gudocs.push.autoPrompted";

export function hasAutoPrompted() {
  try {
    return localStorage.getItem(AUTO_PROMPT_KEY) === "true";
  } catch {
    // 읽을 수 없으면 물어본 적 있다고 쳐서 반복 프롬프트를 막는다.
    return true;
  }
}

export function markAutoPrompted() {
  try {
    localStorage.setItem(AUTO_PROMPT_KEY, "true");
  } catch {
    // 저장 실패는 삼킨다. 최악의 경우 다음 진입에 한 번 더 뜨는 정도다.
  }
}
