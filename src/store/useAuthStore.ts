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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      setTokens: (tokens) => set({ tokens }),
      clearAuth: () => set({ tokens: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

