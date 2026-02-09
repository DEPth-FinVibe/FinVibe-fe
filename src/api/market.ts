import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { CandlestickData, Time } from "lightweight-charts";
import { DateTime } from "luxon";
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
  categoryName: string;
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
  averageChangePct?: number;
  stockCount?: number;
  positiveCount?: number;
  negativeCount?: number;
  updatedAt?: string;
}

interface RawCategoryChangeRateResponse {
  categoryId: number;
  categoryName: string;
  changeRate?: number;
  averageChangePct?: number;
  stockCount?: number;
  positiveCount?: number;
  negativeCount?: number;
  updatedAt?: string;
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

const KST_ZONE = "Asia/Seoul";

export function toKstDateTime(date: Date): string {
  return DateTime.fromJSDate(date).setZone(KST_ZONE).toFormat("yyyy-LL-dd'T'HH:mm:ss");
}

function getKstNowDateTime(): string {
  return DateTime.now().setZone(KST_ZONE).toFormat("yyyy-LL-dd'T'HH:mm:ss");
}

export function getDefaultTimeRange(period: ChartPeriod): { startTime: string; endTime: string } {
  const end = DateTime.now().setZone(KST_ZONE);
  const start = end;

  let startDateTime = start;
  switch (period) {
    case "분봉":
      // 주말/공휴일 대비 3거래일 분량 조회
      startDateTime = start.minus({ days: 3 });
      break;
    case "일봉":
      startDateTime = start.minus({ months: 3 });
      break;
    case "주봉":
      startDateTime = start.minus({ years: 1 });
      break;
    case "월봉":
      startDateTime = start.minus({ years: 3 });
      break;
    case "년봉":
      startDateTime = start.minus({ years: 10 });
      break;
  }

  return {
    startTime: startDateTime.toFormat("yyyy-LL-dd'T'HH:mm:ss"),
    endTime: end.toFormat("yyyy-LL-dd'T'HH:mm:ss"),
  };
}

export interface CandleWithVolume extends CandlestickData<Time> {
  volume: number;
}

function toIntradayTimestamp(at: string): Time {
  if (!at) return 0 as Time;

  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/.test(at);
  const parsed = hasTimezone
    ? DateTime.fromISO(at, { setZone: true })
    : DateTime.fromISO(at, { zone: "Asia/Seoul" });

  if (!parsed.isValid) {
    return 0 as Time;
  }

  return Math.floor(parsed.toSeconds()) as Time;
}

function toChartData(candles: CandleResponse[]): CandleWithVolume[] {
  return candles
    .map((c) => {
      const isIntraday = c.timeframe === "MINUTE" || c.timeframe === "HOUR";
      const time = isIntraday
        ? toIntradayTimestamp(c.at)
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
  const normalizedEndTime = period === "분봉" && !range
    ? getKstNowDateTime()
    : endTime;
  const timeframe = PERIOD_TO_TIMEFRAME[period];

  console.log("[fetchCandles] request:", {
    stockId,
    period,
    timeframe,
    startTime,
    endTime: normalizedEndTime,
  });

  const res = await marketApi.get<CandleResponse[]>(
    `/market/stocks/${stockId}/candles`,
    { params: { startTime, endTime: normalizedEndTime, timeframe } },
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
  const res = await marketApi.get<RawCategoryChangeRateResponse>(
    `/market/categories/${categoryId}/change-rate`,
  );
  const data = res.data;

  return {
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    changeRate: data.changeRate ?? data.averageChangePct ?? 0,
    averageChangePct: data.averageChangePct,
    stockCount: data.stockCount,
    positiveCount: data.positiveCount,
    negativeCount: data.negativeCount,
    updatedAt: data.updatedAt,
  };
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
        ? toIntradayTimestamp(c.at)
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
