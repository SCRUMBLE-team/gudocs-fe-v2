import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./providers/query-provider.tsx";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TDSMobileAITProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </TDSMobileAITProvider>
  </StrictMode>,
);
