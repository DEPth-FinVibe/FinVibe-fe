import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const INSIGHT_BASE =
  import.meta.env.VITE_API_INSIGHT_BASE ??
  (import.meta.env.DEV ? "/api/insight" : "https://finvibe.space/api/insight");

export const insightApiClient = axios.create({
  baseURL: INSIGHT_BASE,
});

// Request: Add Access Token
insightApiClient.interceptors.request.use((config) => {
  const tokens = useAuthStore.getState().tokens;
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
insightApiClient.interceptors.response.use(
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
        return insightApiClient.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);
