import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Tokens = {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
};

interface AuthState {
  tokens: Tokens | null;
  setTokens: (tokens: Tokens | null) => void;
  clearAuth: () => void;
}

// TODO: 개발 완료 후 삭제 - 로그인 우회용 mock token
const DEV_MOCK_TOKENS: Tokens = {
  accessToken: "dev-mock-token",
  accessExpiresAt: "2099-12-31T23:59:59Z",
  refreshToken: "dev-mock-refresh",
  refreshExpiresAt: "2099-12-31T23:59:59Z",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: DEV_MOCK_TOKENS, // TODO: 배포 시 null로 변경
      setTokens: (tokens) => set({ tokens }),
      clearAuth: () => set({ tokens: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

