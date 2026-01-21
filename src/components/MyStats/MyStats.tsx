import React from "react";
import { cn } from "@/utils/cn";
import Chip from "../Chip";

export interface MyStatsProps {
  completedChallenges: number;
  badges: number;
  totalXp: number;
  className?: string;
  onViewStats?: () => void;
}

export const MyStats: React.FC<MyStatsProps> = ({
  completedChallenges,
  badges,
  totalXp,
  className,
  onViewStats,
}) => {
  const stats = [
    { label: "완료한 챌린지", value: `${completedChallenges}개` },
    { label: "획득 배지", value: `${badges}개` },
    { label: "총 경험치", value: `${totalXp.toLocaleString()} XP` },
  ];

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-Subtitle_M_Medium text-black font-bold">내 통계</h3>
        <Chip
          label="통계 보러 가기"
          variant="secondary"
          className=" rounded-full bg-sub-blue text-white"
          onClick={onViewStats}
        />
      </div>
      

      <div className="flex flex-col gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 p-4 rounded-lg border border-sub-blue bg-white"
          >
            <span className="text-Caption_L_Light text-gray-400">{stat.label}</span>
            <span className="text-Subtitle_M_Medium text-sub-blue font-bold">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStats;
