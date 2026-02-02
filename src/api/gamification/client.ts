import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const GAMIFICATION_BASE =
  import.meta.env.VITE_API_GAMIFICATION_BASE ??
  (import.meta.env.DEV ? "/api/gamification" : "https://finvibe.space/api/gamification");

export const gamificationApiClient = axios.create({
  baseURL: GAMIFICATION_BASE,
});

// Request: Add Access Token
gamificationApiClient.interceptors.request.use((config) => {
  const tokens = useAuthStore.getState().tokens;
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Refresh Token logic (wallet/client.ts와 동일 패턴)
async function refreshTokens() {
  const { tokens, setTokens, clearAuth } = useAuthStore.getState();

  if (!tokens?.refreshToken) {
    throw new Error("no refresh token");
  }

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "/api/user" : "https://finvibe.space/api/user")}/auth/refresh`, {
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
gamificationApiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<any>) => {
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const originalRequest = err.config;

    if (status === 401 && code === "INVALID_REFRESH_TOKEN" && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      try {
        const newAccessToken = await refreshTokens();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return gamificationApiClient.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);
