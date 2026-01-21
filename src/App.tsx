import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import HomePage from "@/pages/Home/HomePage";
import OAuthCallbackPage from "@/pages/OAuthCallback/OAuthCallbackPage";
import SimulationPage from "@/pages/Simulation/SimulationPage";
import StockDetailPage from "@/pages/Simulation/StockDetailPage";
import { useAuthStore } from "@/store/useAuthStore";

// 앱 라우팅 설정
function App() {
  const { tokens } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={tokens ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/oauth" element={<SignupPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/simulation/:stockCode" element={<StockDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
