import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

/** 로그인 후 돌아올 경로를 저장하는 sessionStorage 키 (OAuth 외부 리다이렉트 대비) */
export const POST_LOGIN_REDIRECT_KEY = "post-login-redirect";

/**
 * 로그인이 필요한 액션을 감싸는 훅.
 *
 * - 로그인 상태면 액션을 그대로 실행
 * - 비로그인 상태면 안내 후 로그인 페이지로 이동 (로그인 성공 시 원래 경로로 복귀)
 */
export function useRequireAuth() {
  const tokens = useAuthStore((s) => s.tokens);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!tokens;

  const redirectToLogin = useCallback(() => {
    const from = `${location.pathname}${location.search}`;
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, from);
    navigate("/login", { state: { from } });
  }, [location.pathname, location.search, navigate]);

  /**
   * 로그인 상태면 action을 실행하고 true, 비로그인이면 로그인 페이지로 유도하고 false 반환.
   * action 없이 `if (!requireAuth()) return;` 형태의 가드로도 사용 가능.
   */
  const requireAuth = useCallback(
    (action?: () => void, message = "로그인이 필요한 기능입니다.\n로그인 페이지로 이동하시겠습니까?") => {
      if (isLoggedIn) {
        action?.();
        return true;
      }
      if (confirm(message)) {
        redirectToLogin();
      }
      return false;
    },
    [isLoggedIn, redirectToLogin],
  );

  return { isLoggedIn, requireAuth, redirectToLogin };
}
