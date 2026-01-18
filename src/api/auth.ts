import { api } from "./axios";
import type { Tokens } from "@/store/useAuthStore";

export interface SignupRequest {
  loginId?: string;
  password?: string;
  email: string;
  nickname: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  temporaryToken?: string;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export const authApi = {
  // 로컬 회원가입
  signup: (data: SignupRequest) =>
    api.post<{ user: any; tokens: Tokens }>("/auth/signup", data),

  // 로컬 로그인
  login: (data: LoginRequest) => api.post<Tokens>("/auth/login", data),

  // 로그아웃
  logout: () => api.post("/auth/logout"),

  // OAuth 회원가입 완료
  oauthSignup: (data: SignupRequest) =>
    api.post<{ user: any; tokens: Tokens }>("/auth/oauth-signup", data),
};
