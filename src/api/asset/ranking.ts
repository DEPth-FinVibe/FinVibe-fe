import { assetApiClient } from "@/api/asset/client";

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
  /** 사용자 수익률 랭킹 조회: GET /api/rankings/user-profit */
  getUserProfitRanking: async (
    type: RankingPeriod,
    page: number = 0,
    size: number = 50
  ): Promise<UserProfitRankingResponse> => {
    const res = await assetApiClient.get<UserProfitRankingResponse>(
      "/rankings/user-profit",
      {
        params: { type, page, size },
      }
    );
    return res.data;
  },
};
