import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import HomePage from "@/pages/Home/HomePage";
import OAuthCallbackPage from "@/pages/OAuthCallback/OAuthCallbackPage";
import NewsPage from "@/pages/News/NewsPage";
import NewsDetailPage from "@/pages/News/NewsDetailPage";
import ChallengePage from "@/pages/Challenge/ChallengePage";
import AILearningPage from "@/pages/AILearning/AILearningPage";
import MyPage from "@/pages/MyPage/MyPage";
import MyPageSettingsPage from "@/pages/MyPage/MyPageSettingsPage";
import TermsPage from "@/pages/MyPage/TermsPage";
import PrivacyPolicyPage from "@/pages/MyPage/PrivacyPolicyPage";
import MyAssetsPage from "@/pages/MyPage/MyAssetsPage";
import MyPortfolioManagementPage from "@/pages/MyPage/MyPortfolioManagementPage";
import MyChallengesPage from "@/pages/MyPage/MyChallengesPage";
import ServiceRankingPage from "@/pages/ServiceRanking/ServiceRankingPage";
import ServiceRankingUserPage from "@/pages/ServiceRanking/ServiceRankingUserPage";
import { useAuthStore } from "@/store/useAuthStore";
import { useMarketStore } from "@/store/useMarketStore";
import { useMarketStatus } from "@/hooks/useMarketQueries";
import { memberApi } from "@/api/member";
import MainLayout from "@/components/Layout/MainLayout";

// 차트 라이브러리를 사용하는 페이지는 lazy loading
const SimulationPage = lazy(() => import("@/pages/Simulation/SimulationPage"));
const StockDetailPage = lazy(() => import("@/pages/Simulation/StockDetailPage"));

// 앱 라우팅 설정
function App() {
  const { tokens, user, setUser } = useAuthStore();
  const { connect, disconnect } = useMarketStore();
  const { isMarketOpen } = useMarketStatus();

  // 장 열림 + 로그인 시 웹소켓 연결, 장 닫힘 or 로그아웃 시 연결 해제
  useEffect(() => {
    if (tokens && isMarketOpen) {
      connect();
    } else {
      disconnect();
    }
  }, [tokens, isMarketOpen, connect, disconnect]);

  // 로그인 상태에서 유저 정보가 없으면 조회
  useEffect(() => {
    if (!tokens || user) return;
    let cancelled = false;
    memberApi.getMe().then((data) => {
      if (!cancelled) setUser(data);
    }).catch(() => { /* 실패 시 무시 */ });
    return () => { cancelled = true; };
  }, [tokens, user, setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={tokens ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route path="/simulation" element={<Suspense fallback={<div className="flex justify-center items-center h-full">로딩중...</div>}><SimulationPage /></Suspense>} />
          <Route path="/simulation/:stockId" element={<Suspense fallback={<div className="flex justify-center items-center h-full">로딩중...</div>}><StockDetailPage /></Suspense>} />
          <Route path="/ai-learning" element={<AILearningPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:newsId" element={<NewsDetailPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/settings" element={<MyPageSettingsPage />} />
          <Route path="/mypage/terms" element={<TermsPage />} />
          <Route path="/mypage/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/mypage/assets" element={<MyAssetsPage />} />
          <Route path="/mypage/portfolio" element={<MyPortfolioManagementPage />} />
          <Route path="/mypage/challenges" element={<MyChallengesPage />} />
          <Route path="/mypage/service-ranking" element={<ServiceRankingPage />} />
          <Route path="/mypage/service-ranking/user" element={<ServiceRankingUserPage />} />
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
