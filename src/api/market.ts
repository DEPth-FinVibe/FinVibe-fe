import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { CandlestickData, Time } from "lightweight-charts";
import type { ChartPeriod } from "@/pages/Simulation/components/StockChart";

const API_BASE = import.meta.env.VITE_API_BASE
  ? import.meta.env.VITE_API_BASE.replace(/\/user$/, "/market")
  : import.meta.env.DEV
    ? "/api/market"
    : "https://finvibe.space/api/market";

const marketApi = axios.create({
  baseURL: API_BASE,
});

marketApi.interceptors.request.use((config) => {
  const tokens = useAuthStore.getState().tokens;
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// --- Category Types ---

export interface CategoryResponse {
  categoryId: number;
  name: string;
}

export interface CategoryStockListResponse {
  categoryId: number;
  categoryName: string;
  stocks: StockListItem[];
}

export interface CategoryChangeRateResponse {
  categoryId: number;
  categoryName: string;
  changeRate: number;
}

// --- Stock List / Closing Price Types ---

export interface StockListItem {
  stockId: number;
  symbol: string;
  name: string;
  categoryId: number;
}

export interface StockClosingPrice {
  stockId: number;
  stockName: string;
  at: string;
  close: number;
  prevDayChangePct: number;
  volume: number;
  value: number;
}

export interface StockWithPrice {
  stockId: number;
  symbol: string;
  name: string;
  categoryId: number;
  close: number;
  prevDayChangePct: number;
  volume: number;
  value: number;
}

// --- Candle Types ---

export interface CandleResponse {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  value: number;
  stockId: number;
  timeframe: string;
  at: string;
  prevDayChangePct: number;
}

export type IndexType = "KOSPI" | "KOSDAQ";

type Timeframe = "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";

const PERIOD_TO_TIMEFRAME: Record<ChartPeriod, Timeframe> = {
  "분봉": "MINUTE",
  "일봉": "DAY",
  "주봉": "WEEK",
  "월봉": "MONTH",
  "년봉": "YEAR",
};

// 서버가 UTC 기준으로 시간을 검증하므로 UTC로 변환하여 전송
export function toUtcDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

export function getDefaultTimeRange(period: ChartPeriod): { startTime: string; endTime: string } {
  const now = new Date();
  const end = toUtcDateTime(now);

  const start = new Date(now);
  switch (period) {
    case "분봉":
      // 주말/공휴일 대비 3거래일 분량 조회
      start.setDate(start.getDate() - 3);
      break;
    case "일봉":
      start.setMonth(start.getMonth() - 3);
      break;
    case "주봉":
      start.setFullYear(start.getFullYear() - 1);
      break;
    case "월봉":
      start.setFullYear(start.getFullYear() - 3);
      break;
    case "년봉":
      start.setFullYear(start.getFullYear() - 10);
      break;
  }

  return {
    startTime: toUtcDateTime(start),
    endTime: end,
  };
}

export interface CandleWithVolume extends CandlestickData<Time> {
  volume: number;
}

function toChartData(candles: CandleResponse[]): CandleWithVolume[] {
  return candles
    .map((c) => {
      const isIntraday = c.timeframe === "MINUTE" || c.timeframe === "HOUR";
      const time = isIntraday
        ? (Math.floor(new Date(c.at).getTime() / 1000) as Time)
        : (c.at.split("T")[0] as Time);

      return { time, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume ?? 0 };
    })
    .filter((d) => {
      if (typeof d.time === "number" && (isNaN(d.time) || d.time <= 0)) return false;
      if (typeof d.time === "string" && (!d.time || d.time === "undefined")) return false;
      if (d.open == null || d.high == null || d.low == null || d.close == null) return false;
      if (isNaN(d.open) || isNaN(d.high) || isNaN(d.low) || isNaN(d.close)) return false;
      return true;
    });
}

// --- API ---

export async function fetchCandles(
  stockId: number | string,
  period: ChartPeriod,
  range?: { startTime: string; endTime: string },
): Promise<CandleWithVolume[]> {
  const { startTime, endTime } = range ?? getDefaultTimeRange(period);
  const timeframe = PERIOD_TO_TIMEFRAME[period];

  console.log("[fetchCandles] request:", { stockId, period, timeframe, startTime, endTime });

  const res = await marketApi.get<CandleResponse[]>(
    `/market/stocks/${stockId}/candles`,
    { params: { startTime, endTime, timeframe } },
  );

  console.log("[fetchCandles] response:", { stockId, period, count: res.data?.length });

  if (!Array.isArray(res.data) || res.data.length === 0) {
    return [];
  }

  return toChartData(res.data);
}

// --- Stock List APIs ---

export async function fetchTopRising(): Promise<StockListItem[]> {
  const res = await marketApi.get<StockListItem[]>("/market/stocks/top-rising");
  return res.data;
}

export async function fetchTopFalling(): Promise<StockListItem[]> {
  const res = await marketApi.get<StockListItem[]>("/market/stocks/top-falling");
  return res.data;
}

export async function fetchTopByVolume(): Promise<StockListItem[]> {
  const res = await marketApi.get<StockListItem[]>("/market/stocks/top-by-volume");
  return res.data;
}

export async function fetchTopByValue(): Promise<StockListItem[]> {
  const res = await marketApi.get<StockListItem[]>("/market/stocks/top-by-value");
  return res.data;
}

export async function searchStocks(
  query: string,
  marketType?: string,
): Promise<StockListItem[]> {
  const res = await marketApi.get<StockListItem[]>("/market/stocks/search", {
    params: { query, marketType },
  });
  return res.data;
}

export async function fetchClosingPrices(
  stockIds: number[],
): Promise<StockClosingPrice[]> {
  const BATCH_SIZE = 30;

  if (stockIds.length <= BATCH_SIZE) {
    const res = await marketApi.get<StockClosingPrice[]>(
      "/market/stocks/closing-prices",
      { params: { stockIds: stockIds.join(",") } },
    );
    return res.data;
  }

  const batches: number[][] = [];
  for (let i = 0; i < stockIds.length; i += BATCH_SIZE) {
    batches.push(stockIds.slice(i, i + BATCH_SIZE));
  }

  const results = await Promise.all(
    batches.map((batch) =>
      marketApi.get<StockClosingPrice[]>("/market/stocks/closing-prices", {
        params: { stockIds: batch.join(",") },
      }),
    ),
  );

  return results.flatMap((r) => r.data);
}

// --- Market Status Types ---

export interface MarketStatusResponse {
  status: "OPEN" | "CLOSED";
}

export async function fetchMarketStatus(): Promise<MarketStatusResponse> {
  const res = await marketApi.get<MarketStatusResponse>("/market/status");
  return res.data;
}

// --- Category APIs ---

export async function fetchCategories(): Promise<CategoryResponse[]> {
  const res = await marketApi.get<CategoryResponse[]>("/market/categories");
  return res.data;
}

export async function fetchCategoryStocks(
  categoryId: number,
): Promise<CategoryStockListResponse> {
  const res = await marketApi.get<CategoryStockListResponse>(
    `/market/categories/${categoryId}/stocks`,
  );
  return res.data;
}

export async function fetchCategoryChangeRate(
  categoryId: number,
): Promise<CategoryChangeRateResponse> {
  const res = await marketApi.get<CategoryChangeRateResponse>(
    `/market/categories/${categoryId}/change-rate`,
  );
  return res.data;
}

// --- Index Candle API ---

export interface IndexCandleResponse {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  value: number;
  indexType: string;
  timeframe: string;
  at: string;
}

export async function fetchIndexCandles(
  indexType: IndexType,
  period: ChartPeriod = "일봉",
): Promise<CandlestickData<Time>[]> {
  const { startTime, endTime } = getDefaultTimeRange(period);
  const timeframe = PERIOD_TO_TIMEFRAME[period];

  const res = await marketApi.get<IndexCandleResponse[]>(
    `/market/indexes/${indexType}/candles`,
    { params: { startTime, endTime, timeframe } },
  );

  if (!Array.isArray(res.data) || res.data.length === 0) {
    return [];
  }

  return res.data
    .map((c) => {
      const isIntraday = c.timeframe === "MINUTE" || c.timeframe === "HOUR";
      const time = isIntraday
        ? (Math.floor(new Date(c.at).getTime() / 1000) as Time)
        : (c.at.split("T")[0] as Time);
      return { time, open: c.open, high: c.high, low: c.low, close: c.close };
    })
    .filter((d) => {
      if (typeof d.time === "number" && (isNaN(d.time) || d.time <= 0)) return false;
      if (typeof d.time === "string" && (!d.time || d.time === "undefined")) return false;
      if (d.open == null || d.high == null || d.low == null || d.close == null) return false;
      if (isNaN(d.open) || isNaN(d.high) || isNaN(d.low) || isNaN(d.close)) return false;
      return true;
    });
}

// --- Area Chart Data Converter ---

export interface AreaDataPoint {
  time: Time;
  value: number;
}

export function toAreaData(candles: CandlestickData<Time>[]): AreaDataPoint[] {
  return candles.map((c) => ({ time: c.time, value: c.close }));
}

// --- Merge Helper ---

export function mergeStockData(
  stocks: StockListItem[],
  prices: StockClosingPrice[],
): StockWithPrice[] {
  const priceMap = new Map(prices.map((p) => [p.stockId, p]));
  return stocks.map((stock) => {
    const price = priceMap.get(stock.stockId);
    return {
      stockId: stock.stockId,
      symbol: stock.symbol,
      name: stock.name,
      categoryId: stock.categoryId,
      close: price?.close ?? 0,
      prevDayChangePct: price?.prevDayChangePct ?? 0,
      volume: price?.volume ?? 0,
      value: price?.value ?? 0,
    };
  });
}
