import { walletApiClient } from "@/api/wallet/client";
import { api } from "@/api/axios";
import type { AxiosError } from "axios";

export type WalletBalance = {
  walletId: number;
  userId: string; // UUID
  balance: number;
};

export const walletApi = {
  /** 지갑 잔액 조회: GET /api/wallet/wallets/balance */
  getBalance: async (): Promise<WalletBalance> => {
    try {
      // 1) 문서 기준: /api/wallet/wallets/balance
      const res = await walletApiClient.get<WalletBalance>("/wallets/balance");
      return res.data;
    } catch (e) {
      const err = e as AxiosError<any>;

      // 2) 현재 프로젝트는 기본이 /api/user 기반이라, 일부 환경에서는 /api/user/wallet/...로 붙어있을 수 있음
      if (err.response?.status === 404) {
        const res2 = await api.get<WalletBalance>("/wallet/wallets/balance");
        return res2.data;
      }
      throw e;
    }
  },
};


