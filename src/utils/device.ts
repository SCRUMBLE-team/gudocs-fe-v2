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
