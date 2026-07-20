import { Routes, Route } from "react-router-dom";
import { VStack } from "@astryxdesign/core/VStack";
import HomePage from "./routes/home";
import LandingPage from "./routes/landing";
import LoginPage from "./routes/login";
import SubscribeNewPage from "./routes/subscribe/new";

function App() {
  return (
    <VStack
      id="app-root"
      height="100dvh"
      maxWidth={480}
      className="relative mx-auto overflow-hidden bg-surface shadow-lg"
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/subscribe/new" element={<SubscribeNewPage />} />
      </Routes>
    </VStack>
  );
}

export default App;
