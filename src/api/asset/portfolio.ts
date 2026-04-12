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

// 포트폴리오 성과 차트 관련 타입
export type PerformanceChartPoint = {
  periodStartDate: string; // "YYYY-MM-DD" 형식
  totalCurrentValue: number;
  totalReturnRate: number;
};

export type PortfolioPerformanceData = {
  portfolioId: number;
  portfolioName: string;
  points: PerformanceChartPoint[];
};

export type PerformanceChartResponse = {
  interval: "DAILY" | "WEEKLY" | "MONTHLY";
  startDate: string;
  endDate: string;
  portfolios: PortfolioPerformanceData[];
  total: PerformanceChartPoint[];
};

export type TransferAssetBody = {
  targetPortfolioId: number;
};

export const assetPortfolioApi = {
  /** 사용자 포트폴리오 그룹 조회: GET /api/portfolios */
  getPortfolios: async (): Promise<PortfolioGroup[]> => {
    const res = await assetApiClient.get<PortfolioGroup[]>("/portfolios");
    return res.data;
  },

  /** 포트폴리오 그룹 생성: POST /api/portfolios */
  createPortfolio: async (body: CreatePortfolioGroupBody): Promise<void> => {
    await assetApiClient.post("/portfolios", body);
  },

  /** 포트폴리오 그룹 수정: PATCH /api/portfolios/{portfolioGroupId} */
  updatePortfolio: async (
    portfolioGroupId: number,
    body: UpdatePortfolioGroupBody
  ): Promise<void> => {
    await assetApiClient.patch(`/portfolios/${portfolioGroupId}`, body);
  },

  /** 포트폴리오 그룹 삭제: DELETE /api/portfolios/{portfolioGroupId} */
  deletePortfolio: async (portfolioGroupId: number): Promise<void> => {
    await assetApiClient.delete(`/portfolios/${portfolioGroupId}`);
  },

  /** 포트폴리오별 자산 조회: GET /api/portfolios/{portfolioId}/assets */
  getAssetsByPortfolio: async (portfolioId: number): Promise<PortfolioAsset[]> => {
    const res = await assetApiClient.get<PortfolioAsset[]>(
      `/portfolios/${portfolioId}/assets`
    );
    return res.data;
  },

  /** 포트폴리오별 수익 비교 조회: GET /api/portfolios/comparison */
  getPortfolioComparison: async (): Promise<PortfolioComparisonItem[]> => {
    const res = await assetApiClient.get<PortfolioComparisonItem[]>("/portfolios/comparison");
    return res.data;
  },

  /** 전체 자산 배분 조회: GET /api/assets/allocation */
  getAssetAllocation: async (): Promise<AssetAllocationResponse> => {
    const res = await assetApiClient.get<AssetAllocationResponse>("/assets/allocation");
    return res.data;
  },

  /** 자산 이동: PATCH /api/portfolios/{sourcePortfolioId}/assets/{assetId}/transfer */
  transferAsset: async (
    sourcePortfolioId: number,
    assetId: number,
    body: TransferAssetBody
  ): Promise<void> => {
    await assetApiClient.patch(
      `/portfolios/${sourcePortfolioId}/assets/${assetId}/transfer`,
      body
    );
  },

  /** 포트폴리오 성과 차트 조회: GET /api/portfolios/performance-chart */
  getPerformanceChart: async (
    startDate: string,
    endDate: string,
    interval: "DAILY" | "WEEKLY" | "MONTHLY" = "WEEKLY"
  ): Promise<PerformanceChartResponse> => {
    const res = await assetApiClient.get<PerformanceChartResponse>(
      "/portfolios/performance-chart",
      {
        params: { startDate, endDate, interval },
      }
    );
    return res.data;
  },
};
