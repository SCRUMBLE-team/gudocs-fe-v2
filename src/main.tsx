import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// beforeinstallprompt는 로드 직후 한 번만 온다. 화면이 뜨기 전에 리스너가 붙어야 한다.
import "./lib/install-prompt";
import QueryProvider from "./providers/query-provider.tsx";
import { Theme } from "@astryxdesign/core/theme";
import { ToastViewport } from "@astryxdesign/core/Toast";
import { gudocsTheme } from "./theme/gudocs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme theme={gudocsTheme} mode="light">
      <QueryProvider>
        <ToastViewport position="topStart">
          <App />
        </ToastViewport>
      </QueryProvider>
    </Theme>
  </StrictMode>,
);
