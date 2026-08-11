/**
 * PWA 설치 프롬프트 보관소.
 *
 * beforeinstallprompt는 페이지 로드 직후 딱 한 번 발생하고, 기본 동작을
 * preventDefault로 막아두지 않으면 브라우저가 알아서 배너를 띄우거나 흘려보낸다.
 * 마이 화면이 마운트된 뒤에 리스너를 붙으면 이미 지나간 뒤라 영영 못 잡으므로,
 * 리스너를 모듈 로드 시점에 건다. (main.tsx에서 사이드이펙트로 import한다.)
 *
 * 훅은 hooks/useInstallPrompt.ts에 따로 둔다. lib은 명령형 로직만 갖는
 * lib/push.ts와 같은 구조다.
 */

/** TS 기본 lib에 없는 이벤트. Chromium 계열에만 있다. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

// SSR은 없지만 firebase-messaging-sw 같은 워커 컨텍스트에서 import될 여지를 막는다.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    emit();
  });

  // 설치가 끝나면 이 이벤트는 다시 쓸 수 없다. 설치 유도 행도 같이 사라져야 한다.
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    emit();
  });
}

export function subscribeInstallPrompt(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** useSyncExternalStore용 스냅샷. 이벤트 객체는 참조가 그대로라 그대로 반환해도 된다. */
export function getInstallPrompt() {
  return deferredPrompt;
}

/**
 * 네이티브 설치 다이얼로그를 띄운다. 설치를 수락했으면 true.
 *
 * 한 이벤트로 두 번 prompt()하면 브라우저가 throw하므로, 성공이든 거절이든
 * 호출한 이벤트는 버린다. 거절한 경우 다음 로드에서 새 이벤트가 다시 온다.
 */
export async function promptInstall() {
  const event = deferredPrompt;
  if (!event) return false;

  deferredPrompt = null;
  emit();

  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome === "accepted";
  } catch (error) {
    console.warn("[install] 설치 프롬프트를 띄우지 못했어요", error);
    return false;
  }
}
