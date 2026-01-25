import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";
import type { IChartApi, CandlestickData, Time } from "lightweight-charts";

interface StockChartProps {
  data: CandlestickData<Time>[];
  className?: string;
}

export type ChartPeriod = "분봉" | "일봉" | "주봉" | "월봉" | "년봉";

// 기간별 Mock 캔들스틱 데이터 생성
export const generateMockCandleData = (period: ChartPeriod = "일봉"): CandlestickData<Time>[] => {
  const data: CandlestickData<Time>[] = [];
  let basePrice = 71000;
  const now = new Date();

  // 기간별 설정
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
    });

    basePrice = close;
  }

  return data;
};

const StockChart = ({ data, className }: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: "#e0e0e0",
      },
      timeScale: {
        borderColor: "#e0e0e0",
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    // lightweight-charts v5 API
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#FF0000",
      downColor: "#001AFF",
      borderUpColor: "#FF0000",
      borderDownColor: "#001AFF",
      wickUpColor: "#FF0000",
      wickDownColor: "#001AFF",
    });

    candlestickSeries.setData(data);
    chart.timeScale().fitContent();

    // ResizeObserver로 컨테이너 크기 변화 감지
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({
          width: entry.contentRect.width,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className={className} />;
};

export default StockChart;
