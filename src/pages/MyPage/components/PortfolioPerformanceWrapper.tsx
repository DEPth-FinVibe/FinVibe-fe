import React, { useEffect, useState, useMemo } from "react";
import { PortfolioPerformance } from "@/components/PortfolioPerformance";
import { assetPortfolioApi, type AssetHistoryItem } from "@/api/asset";

const PortfolioPerformanceWrapper: React.FC = () => {
  const [assetHistory, setAssetHistory] = useState<AssetHistoryItem[] | null>(null);
  const [historyPeriod, setHistoryPeriod] = useState<"WEEKLY" | "MONTHLY">("WEEKLY");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const history = await assetPortfolioApi.getAssetHistory(historyPeriod);
        if (!alive) return;
        setAssetHistory(history);
      } catch {
        if (!alive) return;
        setAssetHistory(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [historyPeriod]);

  // 그래프 데이터 변환
  const chartData = useMemo(() => {
    if (!assetHistory || assetHistory.length === 0) return null;

    // 날짜를 요일로 변환 (WEEKLY) 또는 날짜로 변환 (MONTHLY)
    const xLabels = assetHistory.map((item) => {
      const date = new Date(item.date);
      if (historyPeriod === "WEEKLY") {
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        return dayNames[date.getDay()];
      } else {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }
    });

    const values = assetHistory.map((item) => item.totalAmount);

    // Y축 최대값 계산 (최대값의 1.2배, 반올림)
    const maxValue = Math.max(...values);
    const yMax = Math.ceil(maxValue * 1.2 / 1_000_000) * 1_000_000;
    const yStep = Math.ceil(yMax / 4 / 1_000_000) * 1_000_000;

    return { xLabels, values, yMax, yStep };
  }, [assetHistory, historyPeriod]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg px-10 py-8 flex items-center justify-center h-96">
        <p className="text-Subtitle_L_Regular text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg px-10 py-8 flex items-center justify-center h-96">
        <p className="text-Subtitle_L_Regular text-gray-400">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 기간 선택 버튼 */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setHistoryPeriod("WEEKLY")}
          className={`px-4 py-2 rounded-lg text-Subtitle_S_Regular ${
            historyPeriod === "WEEKLY"
              ? "bg-main-1 text-white"
              : "bg-white border border-gray-300 text-gray-600"
          }`}
        >
          주간
        </button>
        <button
          type="button"
          onClick={() => setHistoryPeriod("MONTHLY")}
          className={`px-4 py-2 rounded-lg text-Subtitle_S_Regular ${
            historyPeriod === "MONTHLY"
              ? "bg-main-1 text-white"
              : "bg-white border border-gray-300 text-gray-600"
          }`}
        >
          월간
        </button>
      </div>

      <PortfolioPerformance
        xLabels={chartData.xLabels}
        values={chartData.values}
        yMax={chartData.yMax}
        yStep={chartData.yStep}
      />
    </div>
  );
};

export default PortfolioPerformanceWrapper;

