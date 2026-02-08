import { useEffect, useRef } from "react";
import { createChart, AreaSeries } from "lightweight-charts";
import type { IChartApi, Time } from "lightweight-charts";
import type { AreaDataPoint } from "@/api/market";

interface AreaChartProps {
  data: AreaDataPoint[];
  height?: number;
  className?: string;
}

const AreaChart = ({ data, height = 250, className }: AreaChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#999",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "#f0f0f0" },
      },
      width: containerRef.current.clientWidth,
      height,
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#42D6BA",
      topColor: "rgba(66,214,186,0.4)",
      bottomColor: "transparent",
      lineWidth: 2,
    });

    series.setData(data as { time: Time; value: number }[]);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, height]);

  return <div ref={containerRef} className={className} />;
};

export default AreaChart;
