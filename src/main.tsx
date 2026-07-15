import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./providers/query-provider.tsx";
import { TDSMobileAITProvider } from "@toss/tds-mobile-ait";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TDSMobileAITProvider>
        <QueryProvider>
          <App />
        </QueryProvider>
      </TDSMobileAITProvider>
    </BrowserRouter>
  </StrictMode>,
);
