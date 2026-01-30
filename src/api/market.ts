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

// --- Types ---

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

type Timeframe = "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";

const PERIOD_TO_TIMEFRAME: Record<ChartPeriod, Timeframe> = {
  "분봉": "MINUTE",
  "일봉": "DAY",
  "주봉": "WEEK",
  "월봉": "MONTH",
  "년봉": "YEAR",
};

function getDefaultTimeRange(period: ChartPeriod): { startTime: string; endTime: string } {
  const now = new Date();
  const end = now.toISOString().slice(0, 19); // LocalDateTime 형식

  const start = new Date(now);
  switch (period) {
    case "분봉":
      start.setHours(start.getHours() - 6);
      break;
    case "일봉":
      start.setMonth(start.getMonth() - 6);
      break;
    case "주봉":
      start.setFullYear(start.getFullYear() - 2);
      break;
    case "월봉":
      start.setFullYear(start.getFullYear() - 5);
      break;
    case "년봉":
      start.setFullYear(start.getFullYear() - 20);
      break;
  }

  return {
    startTime: start.toISOString().slice(0, 19),
    endTime: end,
  };
}

function toChartData(candles: CandleResponse[]): CandlestickData<Time>[] {
  return candles.map((c) => {
    const isIntraday = c.timeframe === "MINUTE" || c.timeframe === "HOUR";
    const time = isIntraday
      ? (Math.floor(new Date(c.at).getTime() / 1000) as Time)
      : (c.at.split("T")[0] as Time);

    return { time, open: c.open, high: c.high, low: c.low, close: c.close };
  });
}

// --- API ---

export async function fetchCandles(
  stockId: number | string,
  period: ChartPeriod,
  range?: { startTime: string; endTime: string },
): Promise<CandlestickData<Time>[]> {
  const { startTime, endTime } = range ?? getDefaultTimeRange(period);
  const timeframe = PERIOD_TO_TIMEFRAME[period];

  const res = await marketApi.get<CandleResponse[]>(
    `/stocks/${stockId}/candles`,
    { params: { startTime, endTime, timeframe } },
  );

  return toChartData(res.data);
}
