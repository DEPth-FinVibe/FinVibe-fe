import { api } from "../axios";

export type AuthSessionStatus = string;

export interface AuthSessionDto {
  tokenFamilyId: string;
  currentDevice: boolean;
  browserName: string | null;
  osName: string | null;
  location: string | null;
  ipAddress: string | null;
  lastUsedAt: string;
  createdAt: string;
  status: AuthSessionStatus;
}

export const authSessionApi = {
  getSessions: async (): Promise<AuthSessionDto[]> => {
    const response = await api.get<AuthSessionDto[]>("/auth/sessions");
    return Array.isArray(response.data) ? response.data : [];
  },

  revokeSession: async (tokenFamilyId: string): Promise<void> => {
    await api.delete(`/auth/sessions/${tokenFamilyId}`);
  },
};
