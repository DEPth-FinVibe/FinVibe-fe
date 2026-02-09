import { useEffect, useRef, useCallback } from "react";
import { DateTime } from "luxon";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  CrosshairMode,
} from "lightweight-charts";
import type {
  BusinessDay,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  SeriesType,
} from "lightweight-charts";
import type { CandleWithVolume } from "@/api/market";

interface StockChartProps {
  data: CandleWithVolume[];
  period: ChartPeriod;
  className?: string;
  onLoadMore?: (endTime: string) => void;
}

export type ChartPeriod = "분봉" | "일봉" | "주봉" | "월봉" | "년봉";

const KST_ZONE = "Asia/Seoul";

function formatKstTickLabel(time: Time): string {
  if (typeof time === "number") {
    const dt = DateTime.fromSeconds(time, { zone: "utc" }).setZone(KST_ZONE);
    return dt.isValid ? dt.toFormat("MM-dd HH:mm") : "";
  }

  const isoDate = typeof time === "string"
    ? time
    : `${(time as BusinessDay).year}-${String((time as BusinessDay).month).padStart(2, "0")}-${String((time as BusinessDay).day).padStart(2, "0")}`;
  const dt = DateTime.fromISO(isoDate, { zone: KST_ZONE });
  return dt.isValid ? dt.toFormat("MM-dd") : String(time);
}

function formatKstCrosshairTime(time: Time): string {
  if (typeof time === "number") {
    const dt = DateTime.fromSeconds(time, { zone: "utc" }).setZone(KST_ZONE);
    return dt.isValid ? dt.toFormat("yyyy-LL-dd HH:mm") : "";
  }

  const isoDate = typeof time === "string"
    ? time
    : `${(time as BusinessDay).year}-${String((time as BusinessDay).month).padStart(2, "0")}-${String((time as BusinessDay).day).padStart(2, "0")}`;
  const dt = DateTime.fromISO(isoDate, { zone: KST_ZONE });
  return dt.isValid ? dt.toFormat("yyyy-LL-dd") : String(time);
}

// 기간별 Mock 캔들스틱 데이터 생성
export const generateMockCandleData = (period: ChartPeriod = "일봉"): CandleWithVolume[] => {
  const data: CandleWithVolume[] = [];
  let basePrice = 71000;
  const now = new Date();

  const config = {
    "분봉": { count: 60, volatility: 100, getTime: (i: number) => {
      const date = new Date(now);
      date.setMinutes(date.getMinutes() - i);
      return Math.floor(date.getTime() / 1000) as Time;
    }},
    "일봉": { count: 100, volatility: 500, getTime: (i: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0] as Time;
    }},
    "주봉": { count: 52, volatility: 1500, getTime: (i: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      return date.toISOString().split("T")[0] as Time;
    }},
    "월봉": { count: 24, volatility: 3000, getTime: (i: number) => {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      return date.toISOString().split("T")[0] as Time;
    }},
    "년봉": { count: 10, volatility: 10000, getTime: (i: number) => {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() - i);
      return date.toISOString().split("T")[0] as Time;
    }},
  };

  const { count, volatility, getTime } = config[period];

  for (let i = count; i >= 0; i--) {
    const vol = Math.random() * volatility - volatility / 2;
    const open = basePrice + vol;
    const close = open + (Math.random() * volatility * 0.8 - volatility * 0.4);
    const high = Math.max(open, close) + Math.random() * volatility * 0.3;
    const low = Math.min(open, close) - Math.random() * volatility * 0.3;

    data.push({
      time: getTime(i),
      open: Math.round(open),
      high: Math.round(high),
      low: Math.round(low),
      close: Math.round(close),
      volume: Math.round(Math.random() * 100000),
    });

    basePrice = close;
  }

  return data;
};

const StockChart = ({ data, period, className, onLoadMore }: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const isLoadingMoreRef = useRef(false);
  const shouldFitContentRef = useRef(true);

  // 차트 초기 생성 (한 번만)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "#6b7280",
        fontFamily: "'Noto Sans KR', sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#9ca3af",
          width: 1,
          style: 2,
          labelBackgroundColor: "#374151",
        },
        horzLine: {
          color: "#9ca3af",
          width: 1,
          style: 2,
          labelBackgroundColor: "#374151",
        },
      },
      rightPriceScale: {
        borderColor: "#e5e7eb",
        scaleMargins: { top: 0.1, bottom: 0.25 },
      },
      timeScale: {
        borderColor: "#e5e7eb",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 8,
        minBarSpacing: 3,
        tickMarkFormatter: formatKstTickLabel,
      },
      localization: {
        locale: "ko-KR",
        timeFormatter: formatKstCrosshairTime,
      },
    });

    chartRef.current = chart;

    // 캔들스틱 시리즈
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#ef4444",
      downColor: "#3b82f6",
      borderUpColor: "#ef4444",
      borderDownColor: "#3b82f6",
      wickUpColor: "#ef4444",
      wickDownColor: "#3b82f6",
    });
    candleSeriesRef.current = candleSeries;

    // 거래량 히스토그램 시리즈
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

    // 리사이즈 감지
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // 데이터 변경 시 시리즈만 업데이트 (차트 재생성 X)
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !chartRef.current) return;

    const candleData: CandlestickData<Time>[] = data.map(({ volume: _v, ...rest }) => rest);
    candleSeriesRef.current.setData(candleData);

    const volumeData = data.map((d) => ({
      time: d.time,
      value: d.volume,
      color: d.close >= d.open ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)",
    }));
    volumeSeriesRef.current.setData(volumeData);

    if (shouldFitContentRef.current && data.length > 0) {
      chartRef.current.timeScale().fitContent();
      shouldFitContentRef.current = false;
    }
  }, [data]);

  useEffect(() => {
    shouldFitContentRef.current = true;
  }, [period]);

  // 스크롤 시 과거 데이터 로드
  const handleVisibleRangeChange = useCallback(() => {
    if (!onLoadMore || !chartRef.current || isLoadingMoreRef.current) return;

    const logicalRange = chartRef.current.timeScale().getVisibleLogicalRange();
    if (!logicalRange) return;

    // 왼쪽 끝에 도달했을 때 (logicalRange.from이 -10 이하)
    if (logicalRange.from <= -10 && data.length > 0) {
      isLoadingMoreRef.current = true;
      const oldestTime = data[0].time;
      const endTimeStr = typeof oldestTime === "number"
        ? DateTime.fromSeconds(oldestTime).setZone("Asia/Seoul").toFormat("yyyy-LL-dd'T'HH:mm:ss")
        : `${oldestTime}T00:00:00`;
      onLoadMore(endTimeStr);
      // 3초 후 다시 로딩 가능
      setTimeout(() => { isLoadingMoreRef.current = false; }, 3000);
    }
  }, [data, onLoadMore]);

  useEffect(() => {
    if (!chartRef.current || !onLoadMore) return;
    const timeScale = chartRef.current.timeScale();
    timeScale.subscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
    return () => {
      timeScale.unsubscribeVisibleLogicalRangeChange(handleVisibleRangeChange);
    };
  }, [handleVisibleRangeChange, onLoadMore]);

  return <div ref={chartContainerRef} className={className} />;
};

export default StockChart;
