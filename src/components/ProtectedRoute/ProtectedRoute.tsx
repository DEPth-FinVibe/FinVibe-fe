import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/config/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * tokens가 없으면 로그인 페이지로 리다이렉트
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { tokens } = useAuthStore();

  if (!tokens) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

