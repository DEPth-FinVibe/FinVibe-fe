import React from "react";
import { Header } from "@/components";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const NewsPage: React.FC = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white font-noto">
      <Header activeMenu="NEWS" onProfileClick={handleLogout} />
      
      <main className="p-8">
        <h1 className="text-Headline_L_Bold text-black">뉴스 & 토론</h1>
        <p className="text-Body_M_Regular text-gray-400 mt-4">뉴스 & 토론 페이지입니다.</p>
      </main>
    </div>
  );
};

export default NewsPage;

