import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components";
import { useAuthStore } from "@/store/useAuthStore";

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

  const handleMenuClick = (menu: string) => {
    const route = MENU_ROUTES[menu];
    if (route) {
      navigate(route);
    }
  };

  const handleProfileClick = () => {
    // 로그인 상태면 마이페이지, 아니면 로그인으로 유도
    navigate(tokens ? "/mypage" : "/login");
  };

  // 현재 경로에 맞는 활성화된 메뉴 찾기
  const activeMenu = Object.entries(MENU_ROUTES).find(([_, route]) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  })?.[0] || "홈";

  return (
    <div className="min-h-screen bg-white">
      <Header 
        activeMenu={activeMenu} 
        onMenuClick={handleMenuClick} 
        onProfileClick={handleProfileClick}
      />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
