import React from "react";
import { cn } from "@/utils/cn";
import type { SquadRankingItem } from "@/api/gamification";

export interface SquadRankingProps {
  items: SquadRankingItem[];
  mySquadId: number | null;
  onViewAll?: () => void;
  className?: string;
}

const INITIAL_DISPLAY_COUNT = 3;

export const getRankMedal = (rank: number): string | null => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
};

const getRankChangeDisplay = (change: number) => {
  if (change > 0) return { text: `▲${change}`, className: "text-etc-red" };
  if (change < 0) return { text: `▼${Math.abs(change)}`, className: "text-etc-blue" };
  return { text: "-", className: "text-gray-400" };
};

export const SquadRanking: React.FC<SquadRankingProps> = ({
  items,
  mySquadId,
  onViewAll,
  className,
}) => {
  const sorted = [...items].sort((a, b) => a.currentRanking - b.currentRanking);
  const displayItems = sorted.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏫</span>
          <h3 className="text-Subtitle_M_Medium text-black font-bold">실시간 대학 랭킹</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-Body_S_Light text-main-1 font-medium hover:underline"
          >
            대학 전체 보기
          </button>
        )}
      </div>
      <p className="text-Caption_L_Light text-gray-400 mb-6">주간 XP 기준 대학 순위</p>

      <div className="flex flex-col gap-3">
        {displayItems.map((item) => {
          const medal = getRankMedal(item.currentRanking);
          const rankChange = getRankChangeDisplay(item.rankingChange);
          const isMySquad = item.squadId === mySquadId;

          return (
            <div
              key={item.squadId}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                isMySquad
                  ? "bg-main-1/10 border-main-1"
                  : "bg-white border-transparent hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-Body_M_Light text-black w-8 text-center font-medium">
                  {medal ?? `#${item.currentRanking}`}
                </span>
                <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                  {item.squadName.substring(0, 1)}
                </div>
                <div className="flex flex-col">
                  <span className="text-Body_M_Light text-black font-medium">
                    {item.squadName}
                    {isMySquad && (
                      <span className="ml-2 text-Caption_M_Light text-main-1 font-bold">내 학교</span>
                    )}
                  </span>
                  <span className="text-Caption_L_Light text-gray-400">
                    {item.weeklyXp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-Body_M_Light text-black font-medium">
                  {item.weeklyXpChangeRate >= 0 ? "+" : ""}
                  {item.weeklyXpChangeRate.toFixed(1)}%
                </span>
                <span className={cn("text-Caption_L_Light", rankChange.className)}>
                  {rankChange.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SquadRanking;
