import { api } from "@/api/axios";
import { assetApiClient } from "@/api/asset/client";

export type PortfolioGroup = {
  id: number;
  name: string;
  iconCode: string;
};

export type CreatePortfolioGroupBody = {
  name: string;
  iconCode: string;
};

export const assetPortfolioApi = {
  /** 사용자 포트폴리오 그룹 조회: GET /api/asset/portfolios */
  getPortfolios: async (): Promise<PortfolioGroup[]> => {
    try {
      // 1) 문서 기준: /api/asset/portfolios
      const res = await assetApiClient.get<PortfolioGroup[]>("/portfolios");
      return res.data;
    } catch (error: any) {
      // 404 Not Found 발생 시, /api/user/asset 경로로 재시도(게이트웨이 구성 차이 대응)
      if (error?.response?.status === 404) {
        const res2 = await api.get<PortfolioGroup[]>("/asset/portfolios");
        return res2.data;
      }
      throw error;
    }
  },

  /** 포트폴리오 그룹 생성: POST /api/asset/portfolios */
  createPortfolio: async (body: CreatePortfolioGroupBody): Promise<void> => {
    try {
      await assetApiClient.post("/portfolios", body);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        await api.post("/asset/portfolios", body);
        return;
      }
      throw error;
    }
  },
};


