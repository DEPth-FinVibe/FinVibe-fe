import { cn } from "@/utils/cn";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import BookIcon from "@/assets/svgs/BookIcon";
import LockIcon from "@/assets/svgs/LockIcon";

export type BadgeType =
  | "locked"
  | "FIRST_PROFIT"
  | "KNOWLEDGE_SEEKER"
  | "DILIGENT_INVESTOR"
  | "DIVERSIFICATION_MASTER"
  | "BEST_DEBATER"
  | "PERFECT_SCORE_QUIZ"
  | "CHALLENGE_MARATHONER"
  | "TOP_ONE_PERCENT_TRAINER";

export interface BadgeCardProps {
  /** 배지 타입 */
  type: BadgeType;
  /** 배지 제목 */
  title?: string;
  /** 추가 스타일 */
  className?: string;
}

const badgeConfig: Record<BadgeType, {
  bg: string;
  icon: React.ReactNode;
  title: string;
}> = {
  "locked": {
    bg: "bg-gray-100",
    icon: <LockIcon className="w-6 h-[26px] text-gray-500" />,
    title: "미획득",
  },
  "FIRST_PROFIT": {
    bg: "bg-etc-light-yellow",
    icon: <BadgeAwardsIcon className="w-[15px] h-[23px]" color="#FFD166" />,
    title: "첫 수익\n달성",
  },
  "KNOWLEDGE_SEEKER": {
    bg: "bg-etc-light-blue",
    icon: <BookIcon className="w-6 h-[26px] text-etc-blue" />,
    title: "지식\n탐구자",
  },
  "DILIGENT_INVESTOR": {
    bg: "bg-etc-light-green",
    icon: <ChangeRateIcon className="w-6 h-[26px]" color="#00A63E" />,
    title: "성실한\n투자자",
  },
  "DIVERSIFICATION_MASTER": {
    bg: "bg-etc-light-yellow",
    icon: <BadgeAwardsIcon className="w-[15px] h-[23px]" color="#FFD166" />,
    title: "분산투자\n마스터",
  },
  "BEST_DEBATER": {
    bg: "bg-etc-light-blue",
    icon: <BookIcon className="w-6 h-[26px] text-etc-blue" />,
    title: "최고의\n토론자",
  },
  "PERFECT_SCORE_QUIZ": {
    bg: "bg-etc-light-green",
    icon: <ChangeRateIcon className="w-6 h-[26px]" color="#00A63E" />,
    title: "퀴즈\n만점",
  },
  "CHALLENGE_MARATHONER": {
    bg: "bg-etc-light-yellow",
    icon: <BadgeAwardsIcon className="w-[15px] h-[23px]" color="#FFD166" />,
    title: "챌린지\n마라토너",
  },
  "TOP_ONE_PERCENT_TRAINER": {
    bg: "bg-etc-light-blue",
    icon: <BookIcon className="w-6 h-[26px] text-etc-blue" />,
    title: "상위 1%\n트레이너",
  },
};

export const BadgeCard: React.FC<BadgeCardProps> = ({
  type,
  title,
  className,
}) => {
  const config = badgeConfig[type];
  const displayTitle = title || config.title;

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-4 flex flex-col gap-2 items-center justify-center h-[87px] w-[110px]",
        config.bg,
        className
      )}
    >
      <div className="flex items-center justify-center">
        {config.icon}
      </div>
      <p className="text-Subtitle_S_Regular text-[#4C4C4C] text-center whitespace-pre-wrap leading-tight">
        {displayTitle}
      </p>
    </div>
  );
};

