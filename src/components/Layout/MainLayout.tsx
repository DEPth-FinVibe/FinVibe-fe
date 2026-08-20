import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components";
import { useAuthStore } from "@/store/useAuthStore";
import { POST_LOGIN_REDIRECT_KEY } from "@/hooks/useRequireAuth";

const MENU_ROUTES: Record<string, string> = {
  "홈": "/",
  "투자 시뮬레이터": "/simulation",
  "AI 투자 학습": "/ai-learning",
  "뉴스 & 토론": "/news",
  "챌린지": "/challenge",
};

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens } = useAuthStore();

  // Header가 menuRoutes를 받으면 <Link>가 이동을 처리하므로 여기서는 별도 navigate가 필요 없다.
  // menuRoutes 없이 쓰는 경우(Storybook 등)를 위해 핸들러는 유지한다.
  const handleMenuClick = (menu: string) => {
    if (MENU_ROUTES[menu]) return;
    navigate("/");
  };

  const handleProfileClick = () => {
    // 로그인 상태면 마이페이지, 아니면 로그인으로 유도 (로그인 후 현재 경로로 복귀)
    if (tokens) {
      navigate("/mypage");
      return;
    }
    const from = `${location.pathname}${location.search}`;
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, from);
    navigate("/login", { state: { from } });
  };

  // 현재 경로에 맞는 활성화된 메뉴 찾기
  const activeMenu = Object.entries(MENU_ROUTES).find(([, route]) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  })?.[0] || "홈";

  return (
    <div className="min-h-screen bg-white">
      <Header 
        activeMenu={activeMenu} 
        menuRoutes={MENU_ROUTES}
        onMenuClick={handleMenuClick} 
        onProfileClick={handleProfileClick}
        isLoggedIn={!!tokens}
      />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
