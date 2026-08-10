/**
 * 서버 등록 목록에 표시할 기기 이름. "Chrome on macOS" 형태.
 *
 * 판별 순서가 중요하다. Edge와 Opera는 UA에 `Chrome/`을 같이 담고,
 * Chrome은 `Safari/`를 같이 담는다. 좁은 쪽부터 걸러야 한다.
 */
export function getDeviceName() {
  const ua = navigator.userAgent;

  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /SamsungBrowser\//.test(ua)
        ? "Samsung Internet"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Unknown";

  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad|iPod/.test(ua)
        ? "iOS"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown";

  return `${browser} on ${os}`;
}

/**
 * iOS 계열인지. 설치 안내 분기에 쓴다.
 *
 * iOS에는 beforeinstallprompt가 없어서 홈 화면 추가를 코드로 띄울 방법이 없다.
 * iPadOS는 기본이 데스크톱 모드라 UA가 Mac으로 나오므로, 터치 포인트 수까지
 * 봐야 아이패드를 놓치지 않는다.
 */
export function isIOS() {
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1)
  );
}

/** 홈 화면에서 실행 중인지(= 이미 설치됨). iOS는 표준 display-mode 대신 navigator.standalone을 쓴다. */
export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
