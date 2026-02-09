import axios from "axios";
import { api } from "@/api/axios";
import { assetApiClient } from "@/api/asset/client";

export type PortfolioGroup = {
  id: number;
  name: string;
  iconCode: string;
  totalPurchaseAmount: number;
  totalCurrentValue: number;
  totalReturnRate: number;
};

export type CreatePortfolioGroupBody = {
  name: string;
  iconCode: string;
};

export type UpdatePortfolioGroupBody = {
  name: string;
  iconCode: string;
};

export type PortfolioAsset = {
  id: number;
  name: string;
  amount: number;
  totalPrice: number;
  currency: string; // "USD" | "KRW"
  stockId: number;
};

export type CreatePortfolioAssetBody = {
  stockId: number;
  amount: number;
  stockPrice: number;
  name: string;
  currency: string; // "USD" | "KRW"
};

export type DeletePortfolioAssetBody = {
  stockId: number;
  amount: number;
  stockPrice: number;
  currency?: string; // 문서상 optional
};

export type PortfolioComparisonItem = {
  name: string;
  totalAssetAmount: number;
  returnRate: number;
  realizedProfit: number;
};

export type AssetAllocationResponse = {
  cashAmount: number;
  stockAmount: number;
  totalAmount: number;
  changeAmount: number;
  changeRate: number;
};

export type AssetHistoryItem = {
  date: string; // "YYYY-MM-DD" 형식
  totalAmount: number;
};

export type AssetHistoryResponse = AssetHistoryItem[];

export const assetPortfolioApi = {
  /** 사용자 포트폴리오 그룹 조회: GET /api/asset/portfolios */
  getPortfolios: async (): Promise<PortfolioGroup[]> => {
    try {
      // 1) 문서 기준: /api/asset/portfolios
      const res = await assetApiClient.get<PortfolioGroup[]>("/portfolios");
      return res.data;
    } catch (error: unknown) {
      // 404 Not Found 발생 시, /api/user/asset 경로로 재시도(게이트웨이 구성 차이 대응)
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
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
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        await api.post("/asset/portfolios", body);
        return;
      }
      throw error;
    }
  },

  /** 포트폴리오 그룹 수정: PATCH /api/asset/portfolios/{portfolioGroupId} */
  updatePortfolio: async (
    portfolioGroupId: number,
    body: UpdatePortfolioGroupBody
  ): Promise<void> => {
    try {
      await assetApiClient.patch(`/portfolios/${portfolioGroupId}`, body);
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        await api.patch(`/asset/portfolios/${portfolioGroupId}`, body);
        return;
      }
      throw error;
    }
  },

  /** 포트폴리오 그룹 삭제: DELETE /api/asset/portfolios/{portfolioGroupId} */
  deletePortfolio: async (portfolioGroupId: number): Promise<void> => {
    try {
      await assetApiClient.delete(`/portfolios/${portfolioGroupId}`);
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        await api.delete(`/asset/portfolios/${portfolioGroupId}`);
        return;
      }
      throw error;
    }
  },

  /** 포트폴리오별 자산 조회: GET /api/asset/portfolios/{portfolioId}/assets */
  getAssetsByPortfolio: async (portfolioId: number): Promise<PortfolioAsset[]> => {
    try {
      const res = await assetApiClient.get<PortfolioAsset[]>(
        `/portfolios/${portfolioId}/assets`
      );
      return res.data;
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        const res2 = await api.get<PortfolioAsset[]>(
          `/asset/portfolios/${portfolioId}/assets`
        );
        return res2.data;
      }
      throw error;
    }
  },

  /** 자산 등록: POST /api/asset/portfolios/{portfolioId}/assets */
  createAsset: async (portfolioId: number, body: CreatePortfolioAssetBody): Promise<void> => {
    try {
      await assetApiClient.post(`/portfolios/${portfolioId}/assets`, body);
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        await api.post(`/asset/portfolios/${portfolioId}/assets`, body);
        return;
      }
      throw error;
    }
  },

  /** 자산 등록 해제: DELETE /api/asset/portfolios/{portfolioId}/assets */
  deleteAsset: async (portfolioId: number, body: DeletePortfolioAssetBody): Promise<void> => {
    try {
      await assetApiClient.delete(`/portfolios/${portfolioId}/assets`, { data: body });
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        await api.delete(`/asset/portfolios/${portfolioId}/assets`, { data: body });
        return;
      }
      throw error;
    }
  },

  /** 포트폴리오별 수익 비교 조회: GET /api/asset/portfolios/comparison */
  getPortfolioComparison: async (): Promise<PortfolioComparisonItem[]> => {
    try {
      const res = await assetApiClient.get<PortfolioComparisonItem[]>("/portfolios/comparison");
      return res.data;
    } catch (error: unknown) {
      // 404 Not Found 발생 시, /api/user/asset 경로로 재시도
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        const res2 = await api.get<PortfolioComparisonItem[]>("/asset/portfolios/comparison");
        return res2.data;
      }
      throw error;
    }
  },

  /** 전체 자산 배분 조회: GET /api/asset/assets/allocation */
  getAssetAllocation: async (): Promise<AssetAllocationResponse> => {
    try {
      const res = await assetApiClient.get<AssetAllocationResponse>("/assets/allocation");
      return res.data;
    } catch (error: unknown) {
      // 404 Not Found 발생 시, /api/user/asset 경로로 재시도
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        const res2 = await api.get<AssetAllocationResponse>("/asset/assets/allocation");
        return res2.data;
      }
      throw error;
    }
  },

  /** 자산 히스토리 조회: GET /api/asset/assets/history */
  getAssetHistory: async (period: "WEEKLY" | "MONTHLY" = "WEEKLY"): Promise<AssetHistoryResponse> => {
    try {
      const res = await assetApiClient.get<AssetHistoryResponse>("/assets/history", {
        params: { period },
      });
      return res.data;
    } catch (error: unknown) {
      // 404 Not Found 발생 시, /api/user/asset 경로로 재시도
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        const res2 = await api.get<AssetHistoryResponse>("/asset/assets/history", {
          params: { period },
        });
        return res2.data;
      }
      throw error;
    }
  },
};


