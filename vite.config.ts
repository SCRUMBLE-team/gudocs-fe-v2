import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      // lottie-react는 exports 필드가 없어 dev 사전 번들 시 CJS(UMD) 엔트리가
      // 선택되고, default import가 네임스페이스 객체로 바인딩된다.
      // ESM 엔트리를 직접 가리켜 dev/build 동작을 일치시킨다.
      "lottie-react": "lottie-react/build/index.es.js",
    },
  },
});
