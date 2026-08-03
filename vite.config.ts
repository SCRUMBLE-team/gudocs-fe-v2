import { defineConfig, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// 백엔드 오리진. vercel.json의 rewrites destination과 같은 값을 유지해야 한다.
const BACKEND_ORIGIN = "https://3-35-49-217.sslip.io";

// 프록시로 넘길 경로. vercel.json의 rewrites source와 1:1로 대응한다.
const PROXY_PATHS = ["/api", "/oauth2", "/login/oauth2"];

const proxyOptions: ProxyOptions = {
  target: BACKEND_ORIGIN,
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on("proxyRes", (proxyRes) => {
      const setCookie = proxyRes.headers["set-cookie"];
      if (!setCookie) return;
      // 백엔드는 https라 쿠키에 Secure를 붙이지만 dev 서버는 http다.
      // Chrome·Firefox는 localhost를 예외로 두지만 Safari는 Secure 쿠키를
      // 거부하므로, dev에서만 이 속성을 떼어 브라우저 간 동작을 맞춘다.
      proxyRes.headers["set-cookie"] = setCookie.map((cookie) =>
        cookie.replace(/;\s*Secure/gi, ""),
      );
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  server: {
    // 백엔드가 JSESSIONID를 SameSite=Lax로 내려주므로 cross-site 요청에서는
    // 쿠키가 전송·저장되지 않는다(브라우저의 서드파티 쿠키 허용 설정과 무관하다).
    // dev에서도 같은 오리진으로 요청해 first-party 쿠키로 만든다.
    proxy: Object.fromEntries(PROXY_PATHS.map((path) => [path, proxyOptions])),
  },
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      workbox: {
        // FCM 서비스 워커는 public/에 있어서 dist 루트로 복사되고, 그대로 두면
        // 워크박스가 이걸 프리캐시한다. 서비스 워커 스크립트를 다른 SW가
        // 캐싱하면 파일을 고쳐도 갱신이 늦게 반영되므로 목록에서 뺀다.
        globIgnores: ["**/firebase-messaging-sw.js"],
        // navigateFallback은 모든 navigation 요청을 index.html로 돌려버린다.
        // OAuth 시작/콜백과 API는 서버(프록시)의 302·응답을 그대로 받아야 하므로
        // 서비스 워커가 가로채지 않도록 제외한다.
        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/oauth2\//,
          /^\/login\/oauth2\//,
        ],
      },
      manifest: {
        id: "/",
        name: "gudocs",
        short_name: "gudocs",
        description: "구독관리 서비스",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      // lottie-react는 exports 필드가 없어 dev 사전 번들 시 CJS(UMD) 엔트리가
      // 선택되고, default import가 네임스페이스 객체로 바인딩된다.
      // ESM 엔트리를 직접 가리켜 dev/build 동작을 일치시킨다.
      "lottie-react": "lottie-react/build/index.es.js",
    },
  },
});
