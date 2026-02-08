import { api } from "../axios";

// ─── 타입 정의 ───

export type UserResponse = {
  userId: string;
  email: string;
  nickname: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
};

export type UpdateUserRequest = {
  loginId?: string;
  oldPassword?: string;
  newPassword?: string;
  email?: string;
  name?: string;
  nickname?: string;
  birthDate?: string;
  phoneNumber?: string;
};

export type ChangeNicknameRequest = {
  nickname: string;
};

export type DuplicateCheckResponse = {
  duplicate: boolean;
};

export type FavoriteStockResponse = {
  stockId: number;
  name: string;
  userId: string;
};

// ─── API 메서드 ───

export const memberApi = {
  // ── 회원 정보 ──

  /** 내 정보 조회: GET /members/me */
  getMe: async (): Promise<UserResponse> => {
    const res = await api.get<UserResponse>("/members/me");
    return res.data;
  },

  /** 회원 정보 수정: PATCH /members/{userId} */
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<UserResponse> => {
    const res = await api.patch<UserResponse>(`/members/${userId}`, data);
    return res.data;
  },

  /** 회원 탈퇴: DELETE /members/{userId} */
  withdraw: async (userId: string): Promise<void> => {
    await api.delete(`/members/${userId}`);
  },

  /** 닉네임 변경: PATCH /members/{userId}/nickname */
  changeNickname: async (userId: string, nickname: string): Promise<UserResponse> => {
    const res = await api.patch<UserResponse>(`/members/${userId}/nickname`, { nickname });
    return res.data;
  },

  // ── 중복 확인 ──

  /** 닉네임 중복 확인: GET /members/check-nickname */
  checkNickname: async (nickname: string): Promise<DuplicateCheckResponse> => {
    const res = await api.get<DuplicateCheckResponse>("/members/check-nickname", {
      params: { nickname },
    });
    return res.data;
  },

  /** 로그인 아이디 중복 확인: GET /members/check-login-id */
  checkLoginId: async (loginId: string): Promise<DuplicateCheckResponse> => {
    const res = await api.get<DuplicateCheckResponse>("/members/check-login-id", {
      params: { loginId },
    });
    return res.data;
  },

  /** 이메일 중복 확인: GET /members/check-email */
  checkEmail: async (email: string): Promise<DuplicateCheckResponse> => {
    const res = await api.get<DuplicateCheckResponse>("/members/check-email", {
      params: { email },
    });
    return res.data;
  },

  // ── 관심 종목 ──

  /** 관심 종목 조회: GET /members/{userId}/favorite-stocks */
  getFavoriteStocks: async (userId: string): Promise<FavoriteStockResponse[]> => {
    const res = await api.get<FavoriteStockResponse[]>(`/members/${userId}/favorite-stocks`);
    return Array.isArray(res.data) ? res.data : [];
  },

  /** 관심 종목 추가: POST /members/{userId}/favorite-stocks/{stockId} */
  addFavoriteStock: async (userId: string, stockId: number): Promise<FavoriteStockResponse> => {
    const res = await api.post<FavoriteStockResponse>(`/members/${userId}/favorite-stocks/${stockId}`);
    return res.data;
  },

  /** 관심 종목 삭제: DELETE /members/{userId}/favorite-stocks/{stockId} */
  removeFavoriteStock: async (userId: string, stockId: number): Promise<FavoriteStockResponse> => {
    const res = await api.delete<FavoriteStockResponse>(`/members/${userId}/favorite-stocks/${stockId}`);
    return res.data;
  },
};
