import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// 지갑 서비스 전용 baseURL
const WALLET_BASE =
  import.meta.env.VITE_API_WALLET_BASE ??
  (import.meta.env.DEV ? "/api/wallet" : "https://finvibe.space/api/wallet");

export const walletApiClient = axios.create({
  baseURL: WALLET_BASE,
});

// Request: Add Access Token
walletApiClient.interceptors.request.use((config) => {
  const tokens = useAuthStore.getState().tokens;
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Refresh Token logic (user axios.ts와 동일 패턴)
async function refreshTokens() {
  const { tokens, setTokens, clearAuth } = useAuthStore.getState();

  if (!tokens?.refreshToken) {
    throw new Error("no refresh token");
  }

  try {
    // NOTE: refresh는 user 서비스에서 수행
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_BASE ??
        (import.meta.env.DEV ? "/api/user" : "https://finvibe.space/api/user")
      }/auth/refresh`,
      {
        refreshToken: tokens.refreshToken,
      },
    );
    setTokens(res.data);
    return res.data.accessToken as string;
  } catch (error) {
    clearAuth();
    throw error;
  }
}

// Response: Handle token refresh
walletApiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<{ code?: string }>) => {
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const originalRequest = err.config;

    if (
      status === 401 &&
      code === "INVALID_REFRESH_TOKEN" &&
      originalRequest &&
      !(originalRequest as { _retry?: boolean })._retry
    ) {
      (originalRequest as { _retry?: boolean })._retry = true;
      try {
        const newAccessToken = await refreshTokens();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return walletApiClient.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);
