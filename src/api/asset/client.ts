import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// 자산(Asset) 서비스 전용 baseURL
const ASSET_BASE =
  import.meta.env.VITE_API_ASSET_BASE ??
  (import.meta.env.DEV ? "/api/asset" : "https://finvibe.space/api/asset");

export const assetApiClient = axios.create({
  baseURL: ASSET_BASE,
});

// Request: Add Access Token
assetApiClient.interceptors.request.use((config) => {
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
    const userBase =
      import.meta.env.VITE_API_BASE ??
      (import.meta.env.DEV ? "/api/user" : "https://finvibe.space/api/user");

    const res = await axios.post(`${userBase}/auth/refresh`, {
      refreshToken: tokens.refreshToken,
    });

    setTokens(res.data);
    return res.data.accessToken as string;
  } catch (error) {
    clearAuth();
    throw error;
  }
}

// Response: Handle token refresh
assetApiClient.interceptors.response.use(
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
        return assetApiClient.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  },
);
