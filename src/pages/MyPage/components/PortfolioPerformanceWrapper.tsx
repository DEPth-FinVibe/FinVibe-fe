import React, { useEffect, useState, useMemo } from "react";
import { PortfolioPerformance } from "@/components/PortfolioPerformance";
import { assetPortfolioApi, type PerformanceChartResponse } from "@/api/asset";

const PortfolioPerformanceWrapper: React.FC = () => {
  const [performanceChart, setPerformanceChart] = useState<PerformanceChartResponse | null>(null);
  const [historyPeriod, setHistoryPeriod] = useState<"WEEKLY" | "MONTHLY">("WEEKLY");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [currentTotalAsset, setCurrentTotalAsset] = useState<number | null>(null);

  // 현재 시점의 총 평가금 가져오기
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const comparison = await assetPortfolioApi.getPortfolioComparison();
        if (!alive) return;
        const total = Array.isArray(comparison) 
          ? comparison.reduce((sum, item) => sum + item.totalAssetAmount, 0)
          : 0;
        setCurrentTotalAsset(total);
      } catch (error) {
        if (!alive) return;
        console.error("[PortfolioPerformance] 현재 총 평가금 조회 실패:", error);
        setCurrentTotalAsset(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        // 날짜 범위 계산: WEEKLY는 최근 7일, MONTHLY는 최근 7개월
        const today = new Date();
        // 시간대 문제 방지를 위해 UTC 기준으로 날짜 설정
        const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        const endDateStr = endDate.toISOString().split("T")[0]; // YYYY-MM-DD
        
        const startDate = new Date(endDate);
        if (historyPeriod === "WEEKLY") {
          // 최근 7일간 일별 성과 (오늘 포함 7일)
          startDate.setUTCDate(endDate.getUTCDate() - 6); // 오늘 포함해서 7일
        } else {
          // 최근 7개월간 월별 성과 (이번 달 포함 7개월)
          startDate.setUTCMonth(endDate.getUTCMonth() - 6); // 이번 달 포함해서 7개월
          startDate.setUTCDate(1); // 월의 첫 날로 설정
        }
        const startDateStr = startDate.toISOString().split("T")[0]; // YYYY-MM-DD

        // WEEKLY는 최근 7일간 일별 데이터를 요청해야 하므로 interval은 DAILY
        // MONTHLY는 최근 7개월간 월별 데이터를 요청하므로 interval은 MONTHLY
        const apiInterval = historyPeriod === "WEEKLY" ? "DAILY" : "MONTHLY";
        
        const chart = await assetPortfolioApi.getPerformanceChart(
          startDateStr,
          endDateStr,
          apiInterval
        );
        if (!alive) return;
        setPerformanceChart(chart);
        setDateRange({ startDate: startDateStr, endDate: endDateStr });
      } catch (error) {
        if (!alive) return;
        console.error("[PortfolioPerformance] API 호출 실패:", error);
        setPerformanceChart(null);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [historyPeriod]);

  // 그래프 데이터 변환
  const chartData = useMemo(() => {
    const pointCount = historyPeriod === "WEEKLY" ? 7 : 7;
    
    // total과 portfolios 모두 비어있는지 확인
    const hasNoData = !performanceChart || 
      (!performanceChart.total || performanceChart.total.length === 0) &&
      (!performanceChart.portfolios || performanceChart.portfolios.length === 0);
    
    // 데이터가 없을 때: 현재 시점의 총 평가금을 마지막 날짜에 표시
    if (hasNoData) {
      const xLabels: string[] = [];
      const values: number[] = [];
      
      // API 요청 시 사용한 날짜 범위가 있으면 사용, 없으면 계산
      const startDate = dateRange?.startDate 
        ? new Date(dateRange.startDate + "T00:00:00Z")
        : (() => {
            const today = new Date();
            const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
            const start = new Date(endDate);
            if (historyPeriod === "WEEKLY") {
              start.setUTCDate(endDate.getUTCDate() - 6);
            } else {
              start.setUTCMonth(endDate.getUTCMonth() - 6);
              start.setUTCDate(1);
            }
            return start;
          })();
      
      for (let i = 0; i < pointCount; i++) {
        const date = new Date(startDate);
        if (historyPeriod === "WEEKLY") {
          // 시작 날짜부터 순차적으로 7일
          date.setUTCDate(startDate.getUTCDate() + i);
          const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
          xLabels.push(dayNames[date.getUTCDay()]);
        } else {
          // 시작 날짜가 속한 월부터 순차적으로 7개월
          date.setUTCMonth(startDate.getUTCMonth() + i);
          date.setUTCDate(1); // 각 월의 첫 날로 설정
          xLabels.push(`${date.getUTCMonth() + 1}월`);
        }
        
        // 마지막 날짜이고 현재 총 평가금이 있으면 그 값을 사용, 아니면 0
        const isLastDate = i === pointCount - 1;
        if (isLastDate && currentTotalAsset !== null && currentTotalAsset > 0) {
          values.push(currentTotalAsset);
        } else {
          values.push(0);
        }
      }

      // Y축 최대값 계산
      const maxValue = currentTotalAsset && currentTotalAsset > 0 ? currentTotalAsset : 12_000_000;
      const yMax = Math.ceil(maxValue * 1.2 / 1_000_000) * 1_000_000;
      const yStep = Math.ceil(yMax / 4 / 1_000_000) * 1_000_000;
      
      return { xLabels, values, yMax, yStep };
    }

    // total 배열의 데이터 사용
    let totalPoints = performanceChart.total;
    
    // total이 비어있고 portfolios 배열에 데이터가 있으면, portfolios에서 집계
    if ((!totalPoints || totalPoints.length === 0) && performanceChart.portfolios && performanceChart.portfolios.length > 0) {
      
      // 모든 portfolios의 points를 날짜별로 집계
      const aggregatedMap = new Map<string, { totalCurrentValue: number; count: number }>();
      
      performanceChart.portfolios.forEach(portfolio => {
        if (portfolio.points && portfolio.points.length > 0) {
          portfolio.points.forEach(point => {
            const dateKey = point.periodStartDate;
            const existing = aggregatedMap.get(dateKey);
            if (existing) {
              existing.totalCurrentValue += point.totalCurrentValue;
              existing.count += 1;
            } else {
              aggregatedMap.set(dateKey, {
                totalCurrentValue: point.totalCurrentValue,
                count: 1,
              });
            }
          });
        }
      });
      
      // Map을 배열로 변환
      totalPoints = Array.from(aggregatedMap.entries()).map(([date, data]) => ({
        periodStartDate: date,
        totalCurrentValue: data.totalCurrentValue,
        totalReturnRate: 0, // portfolios에서 수익률 집계는 복잡하므로 0으로 설정
      }));
    }
    
    // 데이터를 날짜별로 맵핑 (빠른 조회를 위해)
    // WEEKLY: 날짜 문자열 그대로 사용
    // MONTHLY: YYYY-MM 형식으로 정규화 (월별 집계이므로)
    const dataMap = new Map<string, number>();
    totalPoints.forEach((point) => {
      if (historyPeriod === "WEEKLY") {
        // 일별: 날짜 문자열 그대로 사용
        dataMap.set(point.periodStartDate, point.totalCurrentValue);
      } else {
        // 월별: YYYY-MM 형식으로 정규화
        const date = new Date(point.periodStartDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        dataMap.set(monthKey, point.totalCurrentValue);
      }
    });

    // 전체 기간의 xLabels와 values 생성 (API 요청 시 사용한 날짜 범위 사용)
    const xLabels: string[] = [];
    const values: (number | null)[] = [];
    
    // API 요청 시 사용한 날짜 범위가 있으면 사용, 없으면 계산
    const startDate = dateRange?.startDate 
      ? new Date(dateRange.startDate + "T00:00:00Z")
      : (() => {
          const today = new Date();
          const endDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
          const start = new Date(endDate);
          if (historyPeriod === "WEEKLY") {
            start.setUTCDate(endDate.getUTCDate() - 6);
          } else {
            start.setUTCMonth(endDate.getUTCMonth() - 6);
            start.setUTCDate(1);
          }
          return start;
        })();
    
    for (let i = 0; i < pointCount; i++) {
      const date = new Date(startDate);
      let lookupKey: string;
      
      if (historyPeriod === "WEEKLY") {
        // 시작 날짜부터 순차적으로 7일
        date.setUTCDate(startDate.getUTCDate() + i);
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        xLabels.push(dayNames[date.getUTCDay()]);
        lookupKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else {
        // 시작 월부터 순차적으로 7개월
        date.setUTCMonth(startDate.getUTCMonth() + i);
        xLabels.push(`${date.getUTCMonth() + 1}월`);
        // YYYY-MM 형식으로 정규화
        lookupKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }
      
      // 해당 날짜/월의 데이터가 있으면 값, 없으면 null
      const value = dataMap.get(lookupKey);
      values.push(value !== undefined ? value : null);
    }

    // Y축 최대값 계산 (실제 데이터가 있는 값만 사용)
    const actualValues = values.filter((v): v is number => v !== null);
    if (actualValues.length === 0) {
      // 데이터가 하나도 없으면 기본값 (0으로 채워서 y=0 위치에 표시)
      const yMax = 12_000_000;
      const yStep = 3_000_000;
      const zeroValues = Array.from({ length: pointCount }, () => 0);
      return { xLabels, values: zeroValues, yMax, yStep };
    }
    
    const maxValue = Math.max(...actualValues);
    const yMax = Math.ceil(maxValue * 1.2 / 1_000_000) * 1_000_000;
    const yStep = Math.ceil(yMax / 4 / 1_000_000) * 1_000_000;

    // null 값을 0으로 변환 (그래프에서 표시되지 않도록)
    const chartValues = values.map((v) => v ?? 0);

    return { xLabels, values: chartValues, yMax, yStep };
  }, [performanceChart, historyPeriod, dateRange, currentTotalAsset]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg px-10 py-8 flex items-center justify-center h-96">
        <p className="text-Subtitle_L_Regular text-gray-400">로딩 중...</p>
      </div>
    );
  }

  // chartData는 항상 존재 (데이터 없을 때도 빈 구조 반환)
  if (!chartData) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg px-10 py-8 flex items-center justify-center h-96">
        <p className="text-Subtitle_L_Regular text-gray-400">로딩 중...</p>
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

