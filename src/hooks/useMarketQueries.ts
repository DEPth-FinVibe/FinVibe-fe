import { useQuery } from "@tanstack/react-query";
import {
  fetchTopRising,
  fetchTopFalling,
  fetchTopByVolume,
  fetchTopByValue,
  searchStocks,
  fetchClosingPrices,
  mergeStockData,
  fetchMarketStatus,
} from "@/api/market";

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
