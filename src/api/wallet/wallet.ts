import { walletApiClient } from "@/api/wallet/client";

export type WalletBalance = {
  walletId: number;
  userId: string; // UUID
  balance: number;
};

export const walletApi = {
  /** 지갑 잔액 조회: GET /api/wallets/balance */
  getBalance: async (): Promise<WalletBalance> => {
    const res = await walletApiClient.get<WalletBalance>("/wallets/balance");
    return res.data;
  },
};
