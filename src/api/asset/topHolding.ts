import { assetApiClient } from "@/api/asset/client";

export interface TopHoldingStock {
  stockId: number;
  name: string;
  totalAmount: number;
}

export interface TopHoldingStockListResponse {
  totalElements: number;
  items: TopHoldingStock[];
}

export async function fetchTopHoldingStocks(): Promise<TopHoldingStock[]> {
  const res = await assetApiClient.get<TopHoldingStockListResponse>("/assets/top-100");
  return res.data.items ?? [];
}
