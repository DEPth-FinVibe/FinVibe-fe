import { useQuery, useQueries } from "@tanstack/react-query";
import {
  fetchTopRising,
  fetchTopFalling,
  fetchTopByVolume,
  fetchTopByValue,
  searchStocks,
  fetchClosingPrices,
  mergeStockData,
  fetchMarketStatus,
  fetchIndexCandles,
  fetchCandles,
  fetchCategories,
  fetchCategoryStocks,
  fetchCategoryChangeRate,
  toAreaData,
} from "@/api/market";
import type { IndexType, AreaDataPoint } from "@/api/market";
import type { ChartPeriod } from "@/pages/Simulation/components/StockChart";

// --- 장 상태 훅 ---

export function useMarketStatus() {
  const query = useQuery({
    queryKey: ["market", "status"],
    queryFn: fetchMarketStatus,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  const isMarketOpen = query.data?.status === "OPEN";

  return { ...query, isMarketOpen };
}

// --- 홈페이지용 훅 (상위 10개만 closing-prices 호출) ---

async function fetchTop10WithPrices(
  fetcher: () => Promise<import("@/api/market").StockListItem[]>,
) {
  const stocks = await fetcher();
  const top10 = stocks.slice(0, 10);
  if (top10.length === 0) return [];
  const stockIds = top10.map((s) => s.stockId);
  try {
    const prices = await fetchClosingPrices(stockIds);
    return mergeStockData(top10, prices);
  } catch {
    return mergeStockData(top10, []);
  }
}

export function useTopByValue() {
  return useQuery({
    queryKey: ["market", "top-by-value"],
    queryFn: () => fetchTop10WithPrices(fetchTopByValue),
    staleTime: 30_000,
  });
}

export function useTopByVolume() {
  return useQuery({
    queryKey: ["market", "top-by-volume"],
    queryFn: () => fetchTop10WithPrices(fetchTopByVolume),
    staleTime: 30_000,
  });
}

export function useTopRising() {
  return useQuery({
    queryKey: ["market", "top-rising"],
    queryFn: () => fetchTop10WithPrices(fetchTopRising),
    staleTime: 30_000,
  });
}

export function useTopFalling() {
  return useQuery({
    queryKey: ["market", "top-falling"],
    queryFn: () => fetchTop10WithPrices(fetchTopFalling),
    staleTime: 30_000,
  });
}

// --- SimulationPage용 훅 (전체 목록 + closing-prices) ---

export function useTopByVolumeWithPrices() {
  return useQuery({
    queryKey: ["market", "top-by-volume-with-prices"],
    queryFn: async () => {
      const stocks = await fetchTopByVolume();
      if (stocks.length === 0) return [];
      const stockIds = stocks.map((s) => s.stockId);
      try {
        const prices = await fetchClosingPrices(stockIds);
        return mergeStockData(stocks, prices);
      } catch {
        return mergeStockData(stocks, []);
      }
    },
    staleTime: 30_000,
  });
}

export function useStockSearchWithPrices(query: string, marketType?: string) {
  return useQuery({
    queryKey: ["market", "search", query, marketType],
    queryFn: async () => {
      const stocks = await searchStocks(query, marketType);
      if (stocks.length === 0) return [];
      const stockIds = stocks.map((s) => s.stockId);
      try {
        const prices = await fetchClosingPrices(stockIds);
        return mergeStockData(stocks, prices);
      } catch {
        return mergeStockData(stocks, []);
      }
    },
    enabled: query.length >= 1,
    staleTime: 30_000,
  });
}

// --- 지수 캔들 훅 ---

export function useIndexCandles(indexType: IndexType) {
  return useQuery({
    queryKey: ["market", "index-candles", indexType],
    queryFn: async () => {
      const candles = await fetchIndexCandles(indexType, "일봉");
      if (candles.length === 0) return null;
      const last = candles[candles.length - 1];
      const prev = candles.length >= 2 ? candles[candles.length - 2] : last;
      const currentValue = last.close;
      const changeAmount = currentValue - prev.close;
      const changeRate = prev.close !== 0 ? (changeAmount / prev.close) * 100 : 0;
      return { currentValue, changeAmount, changeRate };
    },
    staleTime: 60_000,
  });
}

// --- 카테고리 훅 ---

export function useCategories() {
  return useQuery({
    queryKey: ["market", "categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  });
}

export function useCategoryChangeRate(categoryId: number | undefined) {
  return useQuery({
    queryKey: ["market", "category-change-rate", categoryId],
    queryFn: () => fetchCategoryChangeRate(categoryId!),
    enabled: categoryId != null,
    staleTime: 60_000,
  });
}

export function useCategoryStocks(categoryId: number | undefined) {
  return useQuery({
    queryKey: ["market", "category-stocks", categoryId],
    queryFn: async () => {
      const data = await fetchCategoryStocks(categoryId!);
      const stockIds = data.stocks.map((s) => s.stockId);
      if (stockIds.length === 0) return { ...data, prices: [] };
      try {
        const prices = await fetchClosingPrices(stockIds);
        return { ...data, prices };
      } catch {
        return { ...data, prices: [] };
      }
    },
    enabled: categoryId != null,
    staleTime: 60_000,
  });
}

export function useAllCategoryChangeRates(categoryIds: number[]) {
  return useQueries({
    queries: categoryIds.map((id) => ({
      queryKey: ["market", "category-change-rate", id],
      queryFn: () => fetchCategoryChangeRate(id),
      staleTime: 60_000,
    })),
  });
}

export function useAllCategoryTopStocks(categoryIds: number[]) {
  return useQueries({
    queries: categoryIds.map((id) => ({
      queryKey: ["market", "category-stocks-light", id],
      queryFn: () => fetchCategoryStocks(id),
      staleTime: 5 * 60_000,
    })),
  });
}

// --- 종목 캔들 훅 (에어리어 차트용) ---

export function useStockCandles(stockId: number | undefined, period: ChartPeriod = "일봉") {
  return useQuery<AreaDataPoint[]>({
    queryKey: ["market", "stock-candles-area", stockId, period],
    queryFn: async () => {
      const candles = await fetchCandles(stockId!, period);
      return toAreaData(candles);
    },
    enabled: stockId != null,
    staleTime: 60_000,
  });
}
