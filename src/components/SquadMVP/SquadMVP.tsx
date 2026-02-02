import React, { useState } from "react";
import { cn } from "@/utils/cn";
import type { SquadContributionItem } from "@/api/gamification";

export interface SquadMVPProps {
  items: SquadContributionItem[];
  className?: string;
}

const INITIAL_DISPLAY_COUNT = 5;

export const SquadMVP: React.FC<SquadMVPProps> = ({ items, className }) => {
  const [expanded, setExpanded] = useState(false);

  const sorted = [...items].sort((a, b) => a.ranking - b.ranking);
  const displayItems = expanded ? sorted : sorted.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">⭐</span>
        <h3 className="text-Subtitle_M_Medium text-black font-bold">우리 학교 MVP</h3>
      </div>
      <p className="text-Caption_L_Light text-gray-400 mb-6">이번 주 기여도 랭킹</p>

      <div className="flex flex-col gap-3">
        {displayItems.map((item) => (
          <div
            key={item.nickname}
            className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-Body_M_Light text-black w-8 text-center font-medium">
                {item.ranking <= 3
                  ? item.ranking === 1
                    ? "🥇"
                    : item.ranking === 2
                    ? "🥈"
                    : "🥉"
                  : `#${item.ranking}`}
              </span>
              <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                {item.nickname.substring(0, 1)}
              </div>
              <span className="text-Body_M_Light text-black font-medium">
                {item.nickname}
              </span>
            </div>
            <span className="text-Body_M_Light text-main-1 font-bold">
              +{item.weeklyContributionXp.toLocaleString()} XP
            </span>
          </div>
        ))}
      </div>

      {sorted.length > INITIAL_DISPLAY_COUNT && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 py-2 text-Body_M_Light text-main-1 font-medium hover:bg-main-1/5 rounded-lg transition-colors"
        >
          {expanded ? "접기" : `소속원 전체 보기 (${sorted.length})`}
        </button>
      )}
    </div>
  );
};

export default SquadMVP;
