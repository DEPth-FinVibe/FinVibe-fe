import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import OAuthCallbackPage from "@/pages/OAuthCallback/OAuthCallbackPage";
import { useAuthStore } from "@/store/useAuthStore";

// 임시 홈 컴포넌트
const HomePage = () => {
  const { tokens, clearAuth } = useAuthStore();

  if (!tokens) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
      <h1 className="text-2xl font-bold font-noto">환영합니다!</h1>
      <p className="font-noto text-gray-600">성공적으로 로그인되었습니다.</p>
      <button
        onClick={clearAuth}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-noto"
      >
        로그아웃
      </button>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/oauth" element={<SignupPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
