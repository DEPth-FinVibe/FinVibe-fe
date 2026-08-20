import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/api/member";

export type Tokens = {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
};

interface AuthState {
  tokens: Tokens | null;
  user: UserResponse | null;
  setTokens: (tokens: Tokens | null) => void;
  setUser: (user: UserResponse | null) => void;
  clearAuth: () => void;
}

// 개발 환경 전용 mock token (VITE_DEV_MOCK_AUTH=true 일 때만 사용, 기본값은 비로그인)
const DEV_MOCK_TOKENS: Tokens | null =
  import.meta.env.DEV && import.meta.env.VITE_DEV_MOCK_AUTH === "true"
  ? {
      accessToken: "dev-mock-token",
      accessExpiresAt: "2099-12-31T23:59:59Z",
      refreshToken: "dev-mock-refresh",
      refreshExpiresAt: "2099-12-31T23:59:59Z",
    }
  : null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: DEV_MOCK_TOKENS,
      user: null,
      setTokens: (tokens) => set({ tokens }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ tokens: null, user: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

/** 로그인 여부 (토큰 보유 여부) */
export const useIsLoggedIn = () => useAuthStore((state) => !!state.tokens);
