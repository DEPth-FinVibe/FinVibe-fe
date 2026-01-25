import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import HomePage from "@/pages/Home/HomePage";
import OAuthCallbackPage from "@/pages/OAuthCallback/OAuthCallbackPage";
import NewsPage from "@/pages/News/NewsPage";
import NewsDetailPage from "@/pages/News/NewsDetailPage";
import ChallengePage from "@/pages/Challenge/ChallengePage";
import AILearningPage from "@/pages/AILearning/AILearningPage";
import { useAuthStore } from "@/store/useAuthStore";
import MainLayout from "@/components/Layout/MainLayout";

// 차트 라이브러리를 사용하는 페이지는 lazy loading
const SimulationPage = lazy(() => import("@/pages/Simulation/SimulationPage"));
const StockDetailPage = lazy(() => import("@/pages/Simulation/StockDetailPage"));

// 앱 라우팅 설정
function App() {
  const { tokens } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={tokens ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route path="/simulation" element={<Suspense fallback={<div className="flex justify-center items-center h-full">로딩중...</div>}><SimulationPage /></Suspense>} />
          <Route path="/simulation/:stockCode" element={<Suspense fallback={<div className="flex justify-center items-center h-full">로딩중...</div>}><StockDetailPage /></Suspense>} />
          <Route path="/ai-learning" element={<AILearningPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:newsId" element={<NewsDetailPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
        </Route>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/oauth" element={<SignupPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
