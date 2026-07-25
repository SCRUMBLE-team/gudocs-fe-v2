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
import { PublicOnlyRoute, RequireAuth } from "./routes/auth-guard";
import { useOnboardingRedirect } from "./hooks/useOnboardingRedirect";

function App() {
  useOnboardingRedirect();

  return (
    <VStack
      id="app-root"
      height="100dvh"
      maxWidth={480}
      className="relative mx-auto overflow-hidden bg-surface shadow-lg"
    >
      <Routes>
        {/* 비로그인 전용 — 로그인 상태로 들어오면 홈으로 돌려보낸다. */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 로그인은 필요하지만 이름은 아직 없어도 되는 구간.
            RequireAuth 안에 넣으면 이름 없는 유저가 무한 리다이렉트한다. */}
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* 로그인 + 이름이 있어야 들어올 수 있는 앱 본체 */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/subscribe" element={<SubscribePage />} />
          </Route>
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/subscribe/:id/edit" element={<SubscribeEditPage />} />
          <Route path="/subscribe/:id" element={<SubscribeDetailPage />} />
          <Route path="/subscribe/new" element={<SubscribeNewPage />} />
        </Route>
      </Routes>
    </VStack>
  );
}

export default App;
