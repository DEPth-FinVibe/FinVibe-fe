import React from "react";
import { cn } from "@/utils/cn";

export interface SquadInfoPanelProps {
  squadName: string;
  currentRanking: number;
  weeklyXpChangeRate: number;
  myContributionPercentile: number;
  mascotImageUrl?: string;
  className?: string;
}

export const SquadInfoPanel: React.FC<SquadInfoPanelProps> = ({
  squadName,
  currentRanking,
  weeklyXpChangeRate,
  myContributionPercentile,
  mascotImageUrl,
  className,
}) => {
  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border border-gray-200", className)}>
      {/* 마스코트 영역 */}
      <div className="flex flex-col items-center mb-6">
        {mascotImageUrl ? (
          <img
            src={mascotImageUrl}
            alt={`${squadName} 마스코트`}
            className="size-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="size-24 rounded-full bg-main-1/10 flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-main-1">
              {squadName.substring(0, 1)}
            </span>
          </div>
        )}
        <h3 className="text-Subtitle_L_Medium text-black font-bold">{squadName}</h3>
        <span className="mt-2 px-3 py-1 rounded-full bg-main-1/10 text-main-1 text-Body_M_Light font-bold">
          현재 {currentRanking}위
        </span>
      </div>

      {/* 통계 카드 */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 p-4 rounded-lg border border-main-1 bg-main-1/5">
          <span className="text-Caption_L_Light text-gray-400">주간 평균 수익률</span>
          <span className={cn(
            "text-Subtitle_M_Medium font-bold",
            weeklyXpChangeRate >= 0 ? "text-main-1" : "text-etc-red"
          )}>
            {weeklyXpChangeRate >= 0 ? "+" : ""}
            {weeklyXpChangeRate.toFixed(1)}%
          </span>
        </div>

        <div className="flex flex-col gap-1 p-4 rounded-lg border border-sub-blue bg-white">
          <span className="text-Caption_L_Light text-gray-400">내 기여도</span>
          <span className="text-Subtitle_M_Medium text-sub-blue font-bold">
            상위 {myContributionPercentile.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SquadInfoPanel;
