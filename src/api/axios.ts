import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { Tokens } from "@/store/useAuthStore";

const API_BASE = import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? "/api/user" : "https://finvibe.space/api/user");

export const api = axios.create({
  baseURL: API_BASE,
});

// Request Interceptor: Add Access Token to Headers
api.interceptors.request.use((config) => {
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
    const res = await axios.post<Tokens>(`${API_BASE}/auth/refresh`, {
      refreshToken: tokens.refreshToken,
    });
    setTokens(res.data);
    return res.data.accessToken;
  } catch (error) {
    clearAuth();
    throw error;
  }
}

// Response Interceptor: Handle Token Expiration
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<any>) => {
    const status = err.response?.status;
    const code = err.response?.data?.code;
    const originalRequest = err.config;

    // INVALID_REFRESH_TOKEN or other auth errors that require refresh
    if (status === 401 && code === "INVALID_REFRESH_TOKEN" && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      try {
        const newAccessToken = await refreshTokens();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(err);
  }
);

