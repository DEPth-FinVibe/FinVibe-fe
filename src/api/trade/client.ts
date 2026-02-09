import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { isTokenExpiredOrExpiring } from "@/utils/tokenExpiry";

// Trade 서비스 전용 baseURL
const TRADE_BASE =
  import.meta.env.VITE_API_TRADE_BASE ??
  (import.meta.env.DEV ? "/api/trade" : "https://finvibe.space/api/trade");

export const tradeApiClient = axios.create({
  baseURL: TRADE_BASE,
});

let refreshPromise: Promise<string> | null = null;

// Request: Add Access Token
tradeApiClient.interceptors.request.use(async (config) => {
  const tokens = useAuthStore.getState().tokens;
  if (!tokens) {
    return config;
  }

  if (isTokenExpiredOrExpiring(tokens.accessExpiresAt)) {
    try {
      const newAccessToken = await refreshTokensOnce();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Refresh Token logic
async function refreshTokens() {
  const { tokens, setTokens, clearAuth } = useAuthStore.getState();

  if (!tokens?.refreshToken) {
    throw new Error("no refresh token");
  }

  try {
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

function refreshTokensOnce(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

// Response: Handle token refresh
tradeApiClient.interceptors.response.use(
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
        const newAccessToken = await refreshTokensOnce();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return tradeApiClient.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);
