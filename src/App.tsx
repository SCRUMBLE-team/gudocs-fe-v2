import { Routes, Route } from "react-router-dom";
import LandingPage from "./routes/landing";

function App() {
  return (
    <div className="max-w-120 m-auto min-h-dvh bg-white shadow-[0_0_20px_#0000000d]">
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        {/* <Route path="login" element={<LoginPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
