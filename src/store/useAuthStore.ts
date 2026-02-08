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

// 개발 환경 전용 mock token (프로덕션에서는 null)
const DEV_MOCK_TOKENS: Tokens | null = import.meta.env.DEV
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
