import { cn } from "@/utils/cn";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import BookIcon from "@/assets/svgs/BookIcon";
import LockIcon from "@/assets/svgs/LockIcon";

export type BadgeType = "first-lecture" | "beginner-master" | "practice-learning" | "locked";

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
  "first-lecture": {
    bg: "bg-etc-light-yellow",
    icon: <BadgeAwardsIcon className="w-[15px] h-[23px]" color="#FFD166" />,
    title: "첫 강의\n완료",
  },
  "beginner-master": {
    bg: "bg-etc-light-blue",
    icon: <BookIcon className="w-6 h-[26px] text-etc-blue" />,
    title: "초급\n마스터",
  },
  "practice-learning": {
    bg: "bg-etc-light-green",
    icon: <ChangeRateIcon className="w-6 h-[26px]" color="#00A63E" />,
    title: "연습\n학습",
  },
  "locked": {
    bg: "bg-gray-100",
    icon: <LockIcon className="w-6 h-[26px] text-gray-500" />,
    title: "미획득",
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

