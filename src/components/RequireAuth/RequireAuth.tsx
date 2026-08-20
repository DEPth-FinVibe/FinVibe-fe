import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { POST_LOGIN_REDIRECT_KEY } from "@/hooks/useRequireAuth";

/**
 * 로그인 사용자만 접근 가능한 라우트 가드.
 * 비로그인 시 로그인 페이지로 보내고, 로그인 성공하면 원래 경로로 복귀시킨다.
 */
const RequireAuth: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const tokens = useAuthStore((s) => s.tokens);
  const location = useLocation();

  if (!tokens) {
    const from = `${location.pathname}${location.search}`;
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, from);
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};

export default RequireAuth;
