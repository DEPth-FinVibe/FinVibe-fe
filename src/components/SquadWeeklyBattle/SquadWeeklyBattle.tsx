import React from "react";
import { cn } from "@/utils/cn";
import type { SquadRankingItem } from "@/api/gamification";

export interface SquadWeeklyBattleProps {
  mySquad: SquadRankingItem;
  rivalSquad: SquadRankingItem | null;
  className?: string;
}

export const SquadWeeklyBattle: React.FC<SquadWeeklyBattleProps> = ({
  mySquad,
  rivalSquad,
  className,
}) => {
  const myXp = mySquad.weeklyXp;
  const rivalXp = rivalSquad?.weeklyXp ?? 0;
  const maxXp = Math.max(myXp, rivalXp, 1);
  const myPercent = (myXp / maxXp) * 100;
  const rivalPercent = (rivalXp / maxXp) * 100;
  const xpDiff = myXp - rivalXp;

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🔥</span>
        <h3 className="text-Subtitle_M_Medium text-black font-bold">금주의 수익률 대결</h3>
      </div>
      <p className="text-Caption_L_Light text-gray-400 mb-6">이번 주 우리 학교의 성적은?</p>

      <div className="flex flex-col gap-5">
        {/* 내 학교 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-Body_M_Light text-black font-medium">{mySquad.squadName}</span>
            <span className="text-Body_M_Light text-main-1 font-bold">
              {myXp.toLocaleString()} XP
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-main-1 rounded-full transition-all duration-500"
              style={{ width: `${myPercent}%` }}
            />
          </div>
        </div>

        {/* VS 뱃지 */}
        <div className="flex items-center justify-center">
          <span className="px-4 py-1 rounded-full bg-gray-100 text-Body_M_Light text-gray-400 font-bold">
            VS
          </span>
        </div>

        {/* 상대 학교 */}
        {rivalSquad ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-Body_M_Light text-black font-medium">{rivalSquad.squadName}</span>
              <span className="text-Body_M_Light text-gray-400 font-bold">
                {rivalXp.toLocaleString()} XP
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-300 rounded-full transition-all duration-500"
                style={{ width: `${rivalPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center text-Body_M_Light text-gray-400">
            1위입니다! 도전자가 없습니다
          </div>
        )}
      </div>

      {/* 점수 차이 메시지 */}
      <div className="mt-6 text-center">
        {xpDiff > 0 ? (
          <p className="text-Body_M_Light text-main-1">
            🎉 <span className="font-bold">{xpDiff.toLocaleString()} XP</span> 앞서고 있어요!
          </p>
        ) : xpDiff < 0 ? (
          <p className="text-Body_M_Light text-etc-red">
            😤 <span className="font-bold">{Math.abs(xpDiff).toLocaleString()} XP</span> 뒤처지고 있어요!
          </p>
        ) : (
          <p className="text-Body_M_Light text-gray-400">
            ⚡ 동점입니다! 역전의 기회!
          </p>
        )}
      </div>
    </div>
  );
};

export default SquadWeeklyBattle;
