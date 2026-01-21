import React from "react";
import { cn } from "@/utils/cn";
import GraphIcon from "@/assets/svgs/GraphIcon";

export interface LeaderboardItem {
  rank: number;
  name: string;
  xp: number;
  isMe?: boolean;
  trend?: "up" | "down" | "stable";
}

export interface LeaderboardProps {
  items: LeaderboardItem[];
  className?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ items, className }) => {
  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🏆</span>
        <h3 className="text-Subtitle_M_Medium text-black font-bold">리더보드</h3>
      </div>
      <p className="text-Caption_L_Light text-gray-400 mb-6">이번 달 상위 랭커</p>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.rank}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border transition-all",
              item.isMe
                ? "bg-main-1/10 border-main-1"
                : "bg-white border-transparent hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="text-Body_M_Medium text-black w-6 text-center">
                #{item.rank}
              </span>
              <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                {item.name.substring(0, 1)}
              </div>
              <div className="flex flex-col">
                <span className="text-Body_M_Medium text-black">
                  {item.isMe ? "당신" : item.name}
                </span>
                <span className="text-Caption_L_Light text-gray-400">
                  {item.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.rank <= 3 && (
                <span className="text-sm">
                  {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : "🥉"}
                </span>
              )}
              {item.trend && (
                <div className={cn(
                  "p-1 rounded bg-gray-50 border border-gray-200 flex items-center justify-center",
                  item.trend === "up" ? "text-etc-red" : "text-etc-blue"
                )}>
                  <GraphIcon className="size-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
