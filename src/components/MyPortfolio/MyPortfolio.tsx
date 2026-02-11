import React from "react";
import { cn } from "@/utils/cn";

export interface MyPortfolioProps {
  /** 포트폴리오 제목 */
  title?: string;
  /** 변화율 (퍼센트) */
  changeRate?: number;
  /* 차트 데이터*/
  chartData?: number[];
  /** 아이콘 컴포넌트 (src/assets/svgs/* 에 있는 컴포넌트 주입용) */
  icon?: React.ComponentType<{ className?: string }>;
  /** 아이콘 색상/스타일 제어 */
  iconClassName?: string;
  /** 추가 스타일 */
  className?: string;
}

/**
 * 나의 포트폴리오 컴포넌트
 * 마이페이지에서 사용자의 포트폴리오 성과를 차트로 표시합니다.
 */
export const MyPortfolio: React.FC<MyPortfolioProps> = ({
  title = "주력 성장주",
  changeRate = 15.2,
  chartData,
  icon,
  iconClassName = "text-black",
  className,
}) => {
  // 기본 차트 데이터 (12개 바)
  const defaultChartData = [30, 100, 60, 58, 80, 93, 70, 80, 89, 78, 54, 72];
  const normalized = (chartData && chartData.length > 0 ? chartData : defaultChartData)
    .map((v) => (Number.isFinite(v) ? Math.max(0, v) : 0));

  // 항상 12개로 고정: 부족하면 0으로 채우고, 많으면 앞에서부터 12개만 사용
  const data = normalized.length >= 12
    ? normalized.slice(0, 12)
    : [...normalized, ...Array.from({ length: 12 - normalized.length }, () => 0)];

  // 변화율 포맷팅
  const formatChangeRate = (rate: number): string => {
    // 0.00%일 때는 부호 없이 표시
    if (rate === 0 || Math.abs(rate) < 0.01) {
      return "0.00%";
    }
    const sign = rate > 0 ? "+" : "";
    return `${sign}${rate.toFixed(2)}%`;
  };

  // 변화율에 따른 색상 결정: 0.00%면 검정색, 양수면 빨간색, 음수면 파란색
  const changeRateColor = 
    changeRate === 0 || Math.abs(changeRate) < 0.01
      ? "text-black"
      : changeRate > 0
      ? "text-etc-red"
      : "text-etc-blue";

  // 차트 높이 (Figma 근사: 표준 Tailwind 높이와 정렬)
  const chartHeight = 80;
  const maxValue = Math.max(...data, 0);

  return (
    <div
      className={cn(
        "bg-white border border-gray-300 rounded-lg px-10 py-8 flex flex-col gap-10 w-full",
        className
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-6">
        {/* 아이콘 */}
        {icon && (
          <div className="size-6 flex items-center justify-center">
            {React.createElement(icon, { className: `w-full h-full ${iconClassName}` })}
          </div>
        )}

        {/* 제목 및 변화율 */}
        <div className="flex flex-col gap-2.5">
          <p className="text-Subtitle_L_Medium text-black">{title}</p>
          <p className={cn("text-Subtitle_S_Regular", changeRateColor)}>
            {formatChangeRate(changeRate)}
          </p>
        </div>
      </div>

      {/* 차트 */}
      <div className="flex gap-1.5 h-20 items-end w-full">
        {data.map((value, index) => {
          const height = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
          return (
            <div
              key={index}
              className="flex-1 bg-gradient-to-b from-main-1 via-[#99e9da] via-[60.577%] to-white rounded-lg min-h-0"
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>
    </div>
  );
};

