import { Routes, Route } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import HomePage from "./routes/home";
import LandingPage from "./routes/landing";
import LoginPage from "./routes/login";
import SubscribeNewPage from "./routes/subscribe/new";
import SubscribePage from "./routes/subscribe";
import Layout from "./routes/layout";
import SubscribeDetailPage from "./routes/subscribe/[id]";
import SubscribeEditPage from "./routes/subscribe/[id]/edit";
import AnalyzePage from "./routes/analyze";
import OnboardingPage from "./routes/onboarding";
import { useOnboardingRedirect } from "./hooks/useOnboardingRedirect";

function App() {
  // 소셜 로그인 후 돌아온 신규 유저를 온보딩 퍼널로 넘긴다.
  // 백엔드 리다이렉트 경로가 어디든 잡히도록 Routes 바깥에 둔다.
  useOnboardingRedirect();

  return (
    <VStack
      id="app-root"
      height="100dvh"
      maxWidth={480}
      className="relative mx-auto overflow-hidden bg-surface shadow-lg"
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
        </Route>
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/subscribe/:id/edit" element={<SubscribeEditPage />} />
        <Route path="/subscribe/:id" element={<SubscribeDetailPage />} />
        <Route path="/subscribe/new" element={<SubscribeNewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </VStack>
  );
}

export default App;
