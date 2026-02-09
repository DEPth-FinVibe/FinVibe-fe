import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  fetchTopRising,
  fetchTopFalling,
  fetchTopByVolume,
  fetchTopByValue,
  searchStocks,
  mergeStockData,
  fetchClosingPrices,
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
import { useAuthStore } from "@/store/useAuthStore";
import { fetchTopHoldingStocks } from "@/api/asset";

// --- 장 상태 훅 ---

export function useMarketStatus() {
  const isLoggedIn = useAuthStore((s) => s.tokens != null);

  const query = useQuery({
    queryKey: ["market", "status"],
    queryFn: fetchMarketStatus,
    enabled: isLoggedIn,
    staleTime: 30_000,
    refetchInterval: isLoggedIn ? 30_000 : false,
  });

  const isMarketOpen = query.data?.status === "OPEN";

  return { ...query, isMarketOpen };
}

// --- 홈페이지용 훅 (상위 10개 기본값 + 장중 WebSocket 반영) ---

function toStocksWithEmptyPrice(
  stocks: import("@/api/market").StockListItem[],
) {
  return stocks.map((stock) => ({
    stockId: stock.stockId,
    symbol: stock.symbol,
    name: stock.name,
    categoryId: stock.categoryId,
    close: 0,
    prevDayChangePct: 0,
    volume: 0,
    value: 0,
  }));
}

async function fetchTop10WithPrices(
  fetcher: () => Promise<import("@/api/market").StockListItem[]>,
  isMarketOpen: boolean,
) {
  const stocks = await fetcher();
  const top10 = stocks.slice(0, 10);
  if (top10.length === 0) return [];
  if (!isMarketOpen) {
    const prices = await fetchClosingPrices(top10.map((stock) => stock.stockId));
    return mergeStockData(top10, prices);
  }
  return toStocksWithEmptyPrice(top10);
}

export function useTopByValue(isMarketOpen: boolean) {
  return useQuery({
    queryKey: ["market", "top-by-value", isMarketOpen],
    queryFn: () => fetchTop10WithPrices(fetchTopByValue, isMarketOpen),
    staleTime: 30_000,
  });
}

export function useTopByVolume(isMarketOpen: boolean) {
  return useQuery({
    queryKey: ["market", "top-by-volume", isMarketOpen],
    queryFn: () => fetchTop10WithPrices(fetchTopByVolume, isMarketOpen),
    staleTime: 30_000,
  });
}

export function useTopRising(isMarketOpen: boolean) {
  return useQuery({
    queryKey: ["market", "top-rising", isMarketOpen],
    queryFn: () => fetchTop10WithPrices(fetchTopRising, isMarketOpen),
    staleTime: 30_000,
  });
}

export function useTopFalling(isMarketOpen: boolean) {
  return useQuery({
    queryKey: ["market", "top-falling", isMarketOpen],
    queryFn: () => fetchTop10WithPrices(fetchTopFalling, isMarketOpen),
    staleTime: 30_000,
  });
}

export function useTopHoldingTop10WithPrices(isMarketOpen: boolean) {
  return useQuery({
    queryKey: ["asset", "top-holding-top10-with-prices", isMarketOpen],
    queryFn: async () => {
      const holdings = await fetchTopHoldingStocks();
      const top10 = holdings.slice(0, 10);
      if (top10.length === 0) return [];

      const closingPriceMap = !isMarketOpen
        ? new Map(
          (await fetchClosingPrices(top10.map((item) => item.stockId))).map((price) => [price.stockId, price]),
        )
        : null;

      return top10.map((item) => ({
        stockId: item.stockId,
        symbol: "",
        name: item.name,
        categoryId: 0,
        close: closingPriceMap?.get(item.stockId)?.close ?? 0,
        prevDayChangePct: closingPriceMap?.get(item.stockId)?.prevDayChangePct ?? 0,
        volume: closingPriceMap?.get(item.stockId)?.volume ?? 0,
        value: closingPriceMap?.get(item.stockId)?.value ?? 0,
      }));
    },
    staleTime: 30_000,
  });
}

// --- SimulationPage용 훅 (전체 목록 기본값 + 장중 WebSocket 반영) ---

export function useTopByVolumeWithPrices(isMarketOpen: boolean) {
  return useQuery({
    queryKey: ["market", "top-by-volume-with-prices", isMarketOpen],
    queryFn: async () => {
      const stocks = await fetchTopByVolume();
      if (stocks.length === 0) return [];
      if (isMarketOpen) {
        return mergeStockData(stocks, []);
      }

      const prices = await fetchClosingPrices(stocks.map((stock) => stock.stockId));
      return mergeStockData(stocks, prices);
    },
    staleTime: 30_000,
  });
}

export function useStockSearchWithPrices(
  query: string,
  isMarketOpen: boolean,
  marketType?: string,
) {
  return useQuery({
    queryKey: ["market", "search", query, isMarketOpen, marketType],
    queryFn: async () => {
      const stocks = await searchStocks(query, marketType);
      if (stocks.length === 0) return [];
      if (isMarketOpen) {
        return mergeStockData(stocks, []);
      }

      const prices = await fetchClosingPrices(stocks.map((stock) => stock.stockId));
      return mergeStockData(stocks, prices);
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
      const sparklineValues = candles
        .slice(-20)
        .map((candle) => candle.close)
        .filter((value) => Number.isFinite(value));

      return { currentValue, changeAmount, changeRate, sparklineValues };
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

export function useCategoryStocks(
  categoryId: number | undefined,
  isMarketOpen: boolean,
) {
  return useQuery({
    queryKey: ["market", "category-stocks", categoryId, isMarketOpen],
    queryFn: async () => {
      const data = await fetchCategoryStocks(categoryId!);
      const prices = isMarketOpen
        ? []
        : await fetchClosingPrices(data.stocks.map((stock) => stock.stockId));
      return {
        ...data,
        prices,
      };
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

export function useDailySparklines(stockIds: number[], pointLimit = 20) {
  const queries = useQueries({
    queries: stockIds.map((stockId) => ({
      queryKey: ["market", "stock-sparkline", "daily", stockId, pointLimit],
      queryFn: async () => {
        const candles = await fetchCandles(stockId, "일봉");
        return candles
          .slice(-pointLimit)
          .map((c) => c.close)
          .filter((value) => Number.isFinite(value));
      },
      enabled: stockId > 0,
      staleTime: 60_000,
    })),
  });

  const dataByStockId = useMemo(() => {
    const map = new Map<number, number[]>();
    queries.forEach((query, index) => {
      if (query.data && query.data.length > 0) {
        map.set(stockIds[index], query.data);
      }
    });
    return map;
  }, [queries, stockIds]);

  const isLoading = queries.some((query) => query.isLoading);

  return { dataByStockId, isLoading };
}
