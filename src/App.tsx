import { Routes, Route } from "react-router-dom";
import LandingPage from "./routes/landing";
import LoginPage from "./routes/login";
import HomePage from "./routes/home";
import SubscribeNewPage from "./routes/subscribe/new";

function App() {
  return (
    <div
      id="app-root"
      className="app-scroll max-w-120 overflow-auto m-auto h-dvh bg-white shadow-[0_0_20px_#0000000d] contain-layout"
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/subscribe/new" element={<SubscribeNewPage />} />
      </Routes>
    </div>
  );
}

export default App;
