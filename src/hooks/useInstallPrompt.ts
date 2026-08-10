import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  getInstallPrompt,
  promptInstall,
  subscribeInstallPrompt,
} from "../lib/install-prompt";
import { isIOS, isStandalone } from "../utils/device";

/**
 * 홈 화면 추가(PWA 설치) 유도에 필요한 상태.
 *
 * 설치 경로가 두 갈래다. Chromium 계열은 beforeinstallprompt를 잡아 네이티브
 * 다이얼로그를 띄울 수 있지만, iOS Safari에는 그 API 자체가 없어서 공유 버튼을
 * 누르라고 안내하는 수밖에 없다.
 */
export function useInstallPrompt() {
  const deferred = useSyncExternalStore(
    subscribeInstallPrompt,
    getInstallPrompt,
    () => null,
  );

  // 초기값을 lazy initializer로 넣어야 첫 페인트에 설치 유도가 깜빡이지 않는다.
  const [installed, setInstalled] = useState(isStandalone);

  // 설치 직후 브라우저가 standalone 창으로 옮겨가는 경우를 따라간다.
  useEffect(() => {
    const query = window.matchMedia("(display-mode: standalone)");
    const onChange = () => setInstalled(isStandalone());
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const install = useCallback(async () => {
    const accepted = await promptInstall();
    if (accepted) setInstalled(true);
    return accepted;
  }, []);

  return {
    /** 네이티브 설치 다이얼로그를 띄울 수 있는 상태 */
    canPrompt: !installed && deferred !== null,
    /** 수동 설치 안내가 필요한 상태 (iOS Safari) */
    needsGuide: !installed && deferred === null && isIOS(),
    install,
  };
}
