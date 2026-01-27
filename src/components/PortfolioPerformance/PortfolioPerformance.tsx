import React, { useMemo } from "react";
import { cn } from "@/utils/cn";

export interface PortfolioPerformanceProps {
  /** 섹션 제목 */
  title?: string;
  /** x축 라벨 (기본: 월~일) */
  xLabels?: string[];
  /** 값(원 단위). xLabels 길이와 같아야 함 */
  values?: number[];
  /** y축 최대값(원). 기본: 12,000,000 */
  yMax?: number;
  /** y축 틱 간격(원). 기본: 3,000,000 */
  yStep?: number;
  /** 라인/포인트 색상 */
  lineColor?: string;
  /** 추가 스타일 */
  className?: string;
}

const DEFAULT_X_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const DEFAULT_VALUES = [
  10_000_000,
  10_150_000,
  10_100_000,
  10_300_000,
  10_250_000,
  10_400_000,
  10_450_000,
];

const formatWonToMillion = (value: number) => `₩${(value / 1_000_000).toFixed(1)}M`;

/**
 * 포트폴리오 성과(라인 차트) 섹션
 * - Figma(693:10608) 기준: 흰색 카드 + 좌측 금액 라벨 + 하단 요일 라벨 + 그리드 + 라인/포인트
 */
export const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  title = "포트폴리오 성과",
  xLabels = DEFAULT_X_LABELS,
  values = DEFAULT_VALUES,
  yMax = 12_000_000,
  yStep = 3_000_000,
  lineColor = "#FFD166", // point.yellow
  className,
}) => {
  const data = useMemo(() => {
    const len = Math.min(xLabels.length, values.length);
    const safeLabels = xLabels.slice(0, len);
    const safeValues = values.slice(0, len).map((v) => (Number.isFinite(v) ? v : 0));
    return { safeLabels, safeValues };
  }, [xLabels, values]);

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let v = yMax; v >= 0; v -= yStep) ticks.push(v);
    return ticks;
  }, [yMax, yStep]);

  // SVG 좌표계 (플롯 영역만)
  const plotW = 1000;
  // 화면에 그려지는 높이와 동일하게 맞춰야 Y라벨/그리드 정렬이 틀어지지 않음
  const plotH = 355;
  const n = Math.max(2, data.safeValues.length);
  // Figma 기준
  const xTickLen = 8.76; // 아래로
  const yTickLen = 8.38; // 왼쪽으로
  // Figma 텍스트 박스(라벨) 관련
  const labelFontSize = 18.009;
  const labelBoxH = 24.969;
  // tick과 텍스트 사이 여백(요청: 선 바로 아래에 텍스트)
  const xLabelGap = 1;
  // 축 바깥으로 뻗는 선/라벨을 viewBox에 포함시키기 위한 여백
  // - 좌측: 금액 라벨 폭(약 85.176) + y tick(8.38) + 약간의 여백
  const leftLabelW = 85.176;
  const leftGutter = leftLabelW + yTickLen + 4;
  // - 상단: 최상단(₩12.0M) 라벨이 y=0에서 위로 반 잘리지 않도록
  const topGutter = labelBoxH / 2;
  // - 우측: "일" 라벨/축 선이 가장자리에서 잘리지 않도록 소량 여백
  const rightGutter = 8;
  // - 하단: x tick(8.76) + gap + 텍스트 박스 높이(24.969)
  const bottomGutter = xTickLen + xLabelGap + labelBoxH;

  const points = useMemo(() => {
    return data.safeValues.map((v, i) => {
      const x = (i / (n - 1)) * plotW;
      const y = plotH - Math.max(0, Math.min(v, yMax)) / yMax * plotH;
      return { x, y };
    });
  }, [data.safeValues, n, yMax]);

  const linePath = useMemo(() => {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
  }, [points]);

  return (
    <section
      className={cn(
        "bg-white border border-gray-300 rounded-lg px-10 py-8 flex flex-col gap-10 w-full",
        className
      )}
      aria-label={title}
    >
      <h2 className="text-Title_L_Medium text-black">{title}</h2>

      {/* 차트 영역 (축/틱/라벨을 모두 SVG에서 처리해서 Figma와 동일하게 픽셀 정렬) */}
      <div className="w-full h-96">
        <svg
          // 좌/하 여백을 포함해서 축 바깥(tick/라벨)까지 한 좌표계로 그리기
          viewBox={`${-leftGutter} ${-topGutter} ${plotW + leftGutter + rightGutter} ${plotH + bottomGutter + topGutter}`}
          className="w-full h-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="포트폴리오 성과 차트"
        >
                {/* Y축 틱 (그래프 바깥: 왼쪽으로) */}
                {yTicks.map((_, idx) => {
                  const y = (idx / (yTicks.length - 1 || 1)) * plotH;
                  return (
                    <line
                      key={`yt-${idx}`}
                      x1={0}
                      x2={-yTickLen}
                      y1={y}
                      y2={y}
                      stroke="#1F3B70"
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* Y축 라벨(금액) - 선(틱/그리드) '중앙'에 맞춤 */}
                {yTicks.map((t, idx) => {
                  const y = (idx / (yTicks.length - 1 || 1)) * plotH;
                  return (
                    <text
                      key={`yl-${t}`}
                      x={-(yTickLen + 4)}
                      y={y}
                      fill="#1F3B70"
                      fontSize={labelFontSize}
                      textAnchor="end"
                      dominantBaseline="middle"
                    >
                      {formatWonToMillion(t)}
                    </text>
                  );
                })}

                {/* 그리드(수평) */}
                {yTicks.map((_, idx) => {
                  const y = (idx / (yTicks.length - 1 || 1)) * plotH;
                  return (
                    <line
                      key={`h-${idx}`}
                      x1={0}
                      x2={plotW}
                      y1={y}
                      y2={y}
                      stroke="#C7C7C9"
                      strokeOpacity={0.4}
                      strokeDasharray="4 4"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* 그리드(수직): 요일 기준 7등분 */}
                {data.safeLabels.map((_, i) => {
                  const x = (i / (n - 1)) * plotW;
                  return (
                    <line
                      key={`v-${i}`}
                      x1={x}
                      x2={x}
                      y1={0}
                      y2={plotH}
                      stroke="#C7C7C9"
                      strokeOpacity={0.4}
                      strokeDasharray="4 4"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* 축(좌/하) */}
                <line
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={plotH}
                  stroke="#1F3B70"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={0}
                  x2={plotW}
                  y1={plotH}
                  y2={plotH}
                  stroke="#1F3B70"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />

                {/* X축 틱 (그래프 바깥: 아래로) */}
                {data.safeLabels.map((_, i) => {
                  const x = (i / (n - 1)) * plotW;
                  return (
                    <line
                      key={`xt-${i}`}
                      x1={x}
                      x2={x}
                      y1={plotH}
                      y2={plotH + xTickLen}
                      stroke="#1F3B70"
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* X축 라벨(요일) - tick 바로 아래에 배치, tick의 중앙선과 텍스트 중앙이 같은 X */}
                {data.safeLabels.map((label, i) => {
                  const x = (i / (n - 1)) * plotW;
                  return (
                    <text
                      key={`xl-${label}`}
                      x={x}
                      y={plotH + xTickLen + xLabelGap}
                      fill="#1F3B70"
                      fontSize={labelFontSize}
                      // 모든 요일(월~일) 텍스트의 '중앙'이 tick(벡터) 중심선과 일치하도록 통일
                      textAnchor="middle"
                      dominantBaseline="hanging"
                    >
                      {label}
                    </text>
                  );
                })}

                {/* 라인 */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={lineColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {/* 포인트 */}
                {points.map((p, i) => (
                  <circle
                    key={`p-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={5}
                    fill={lineColor}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
        </svg>
      </div>
    </section>
  );
};

export default PortfolioPerformance;


