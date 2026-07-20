import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./providers/query-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Theme } from "@astryxdesign/core/theme";
import { gudocsTheme } from "./theme/gudocs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Theme theme={gudocsTheme} mode="light">
        <QueryProvider>
          <App />
        </QueryProvider>
      </Theme>
    </BrowserRouter>
  </StrictMode>,
);
