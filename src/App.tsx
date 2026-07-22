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

function App() {
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
        <Route path="/subscribe/:id/edit" element={<SubscribeEditPage />} />
        <Route path="/subscribe/:id" element={<SubscribeDetailPage />} />
        <Route path="/login" element={<LoginPage />} />\
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/subscribe/new" element={<SubscribeNewPage />} />
      </Routes>
    </VStack>
  );
}

export default App;
