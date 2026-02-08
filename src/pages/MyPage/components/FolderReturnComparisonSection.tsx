import React from "react";
import { cn } from "@/utils/cn";

export type FolderReturnBarData = {
  label: string;
  value: number;
  tone: "red" | "blue" | "gray";
};

type Props = {
  barData: FolderReturnBarData[];
  /** y축 틱 간격(%) - 기본 6 */
  yStep?: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Figma(2123:34699) 기준: 축/그리드가 연회색 톤
const AXIS_COLOR = "#E5E7EB"; // gray-200
const LABEL_COLOR = "#666666";
const TICK_LEN_PX = 7.388;

const FolderReturnComparisonSection: React.FC<Props> = ({ barData, yStep = 6 }) => {
  // barData에 따라 y축 범위 자동 계산 (0 포함)
  const values = barData.map((b) => (Number.isFinite(b.value) ? b.value : 0));
  // 요구사항: 0%를 기준선으로 양/음수 모두 표시
  const rawMin = Math.min(0, ...values);
  const rawMax = Math.max(0, ...values);

  const yMin = Math.floor(rawMin / yStep) * yStep;
  const yMax = Math.ceil(rawMax / yStep) * yStep || yStep;

  const ticks: number[] = [];
  for (let t = yMax; t >= yMin; t -= yStep) ticks.push(t);

  return (
    <div className="w-full">
      <div className="grid grid-cols-[80px_1fr] gap-0">
        {/* Y축 라벨 */}
        <div className="relative h-56 text-[14px] leading-5" style={{ color: LABEL_COLOR }}>
          {ticks.map((t) => {
            const y = ((yMax - t) / (yMax - yMin)) * 100;
            return (
              <div
                key={t}
                className="absolute right-0 -translate-y-1/2 flex items-center justify-end gap-2"
                style={{ top: `${y}%` }}
              >
                <span>{t}%</span>
                {/* Y축 틱(벡터) - 라벨 옆 */}
                <span
                  className="shrink-0"
                  style={{
                    width: `${TICK_LEN_PX}px`,
                    height: 0,
                    borderTop: `1px solid ${LABEL_COLOR}`,
                  }}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        <div className="w-full">
          {/* 플롯 영역 (축선: Y=왼쪽, X=가장 아래만 실선) */}
          <div className="relative h-56 border-l border-b" style={{ borderColor: AXIS_COLOR }}>
            {/* 그리드 라인(수평) - 가장 아래(yMin)는 border-b(실선)로 처리 */}
            {ticks
              .filter((t) => t !== yMin)
              .map((t) => {
                const y = ((yMax - t) / (yMax - yMin)) * 100;
                return (
                  <div
                    key={`h-${t}`}
                    className="absolute left-0 right-0 border-t border-dashed opacity-60"
                    style={{ top: `${y}%`, borderColor: AXIS_COLOR }}
                  />
                );
              })}

            {/* 그리드 라인(수직) - x축 라벨 틱(벡터)와 동일한 위치(각 항목 중앙) */}
            <div className="absolute inset-0 px-10 pointer-events-none">
              <div className="h-full flex justify-around">
                {barData.map((b) => (
                  <div key={`vg-${b.label}`} className="w-40 relative h-full">
                    <div
                      className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed opacity-60"
                      style={{ borderColor: AXIS_COLOR }}
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bars */}
            <div className="absolute inset-0 px-10">
              <div className="h-full flex justify-around">
                {barData.map((b) => {
                  const v = clamp(b.value, yMin, yMax);
                  const zeroPct = ((yMax - 0) / (yMax - yMin)) * 100;
                  const valPct = ((yMax - v) / (yMax - yMin)) * 100;

                  // 양수: 0%에서 위로 / 음수: 0%에서 아래로
                  const isPositive = v >= 0;
                  const top = isPositive ? valPct : zeroPct;
                  const height = isPositive
                    ? Math.max(0, zeroPct - valPct)
                    : Math.max(0, valPct - zeroPct);
                  const color =
                    b.tone === "blue"
                      ? "bg-[#3B82F6]"
                      : b.tone === "gray"
                        ? "bg-[#9CA3AF]"
                        : "bg-etc-red";
                  const rounded = isPositive ? "rounded-t" : "rounded-b";

                  return (
                    <div key={b.label} className="w-40 relative h-full">
                      <div
                        // 0% 기준선과 맞닿는 면은 각지게(라운드 없음)
                        className={cn("absolute left-0 right-0", rounded, color)}
                        style={{ top: `${top}%`, height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X축 라벨(바깥) + X축 틱(벡터) */}
          <div className="flex justify-around px-10 -mt-px">
            {barData.map((b) => (
              <div key={`xl-${b.label}`} className="w-40 flex flex-col items-center gap-0.5">
                <span
                  className="shrink-0"
                  style={{
                    width: 0,
                    height: `${TICK_LEN_PX}px`,
                    borderLeft: `1px solid ${LABEL_COLOR}`,
                  }}
                  aria-hidden="true"
                />
                <p className="text-[14px] leading-5" style={{ color: LABEL_COLOR }}>
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderReturnComparisonSection;


