import axios from "axios";
import { assetApiClient } from "@/api/asset/client";
import { api } from "@/api/axios";

export type RankingPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export type UserProfitRankingItem = {
  rank: number;
  userId: string;
  nickname?: string; // 백엔드에서 추가 예정
  returnRate: number;
  profitLoss: number;
};

export type UserProfitRankingResponse = {
  rankType: RankingPeriod;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  items: UserProfitRankingItem[];
};

export const assetRankingApi = {
  /** 사용자 수익률 랭킹 조회: GET /api/asset/rankings/user-profit */
  getUserProfitRanking: async (
    type: RankingPeriod,
    page: number = 0,
    size: number = 50
  ): Promise<UserProfitRankingResponse> => {
    try {
      const res = await assetApiClient.get<UserProfitRankingResponse>(
        "/rankings/user-profit",
        {
          params: { type, page, size },
        }
      );
      return res.data;
    } catch (error: unknown) {
      // 404 Not Found 발생 시, /api/user/asset 경로로 재시도
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        const res2 = await api.get<UserProfitRankingResponse>(
          "/asset/rankings/user-profit",
          {
            params: { type, page, size },
          }
        );
        return res2.data;
      }
      throw error;
    }
  },
};

