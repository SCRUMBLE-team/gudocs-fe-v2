/*
 * FCM 백그라운드 수신 전용 서비스 워커.
 *
 * public/ 파일은 Vite가 번들·변환하지 않고 그대로 복사한다. 그래서 여기서는
 * import.meta.env도 npm import도 못 쓴다. 두 가지로 우회한다.
 *   1) Firebase SDK는 compat CDN을 importScripts로 로드
 *   2) Firebase 설정은 앱이 register()할 때 쿼리스트링으로 넘겨주고 여기서 읽음
 *
 * (2)를 택한 이유: .env가 gitignore라서 설정을 하드코딩하면 값이 git에 들어가고
 * 이중 관리가 된다. 등록 코드는 src/lib/push.ts의 registerFcmServiceWorker다.
 *
 * CDN 버전은 package.json의 firebase 버전과 맞춰야 한다. 업그레이드 시 같이 올릴 것.
 */
importScripts(
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js",
);

const params = new URL(self.location.href).searchParams;

firebase.initializeApp({
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
});

const messaging = firebase.messaging();

/*
 * 서버가 data-only로 보내므로 알림 표시를 직접 해야 한다.
 * (notification 키가 있는 메시지는 브라우저가 자동 표시하고 이 콜백은
 *  호출되지 않는다. SDK 버전에 따라 불릴 수 있어 중복 표시만 막아둔다.)
 */
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;

  const data = payload.data || {};
  if (!data.title && !data.body) return;

  self.registration.showNotification(data.title || "gudocs", {
    body: data.body,
    icon: "/pwa-192x192.png",
    badge: "/pwa-192x192.png",
    data: { link: data.link },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data && event.notification.data.link;
  if (link) event.waitUntil(openLink(link));
});

async function openLink(link) {
  const url = new URL(link, self.location.origin);
  // link는 서버가 채우는 값이다. 외부 오리진으로 튀지 않게 막는다.
  if (url.origin !== self.location.origin) return;

  const windows = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  const client = windows.find((c) => new URL(c.url).origin === url.origin);

  if (client) {
    await client.focus();
    // 이 워커는 전용 스코프라 앱 페이지를 제어하지 않는다. 제어하지 않는
    // 클라이언트에는 client.navigate()를 쓸 수 없어서 앱에 이동을 맡긴다.
    // 받는 쪽은 src/components/push-bridge.tsx다.
    client.postMessage({
      type: "PUSH_NAVIGATE",
      link: url.pathname + url.search,
    });
    return;
  }

  await self.clients.openWindow(url.href);
}
