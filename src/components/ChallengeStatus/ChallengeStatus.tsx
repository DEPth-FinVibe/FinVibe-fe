import { cn } from "@/utils/cn";
import PinIcon from "@/assets/svgs/PinIcon";
import CalendarIcon from "@/assets/svgs/CalendarIcon";
import AwardsIcon from "@/assets/svgs/AwardsIcon";

export type ChallengeDifficulty = "쉬움" | "보통" | "어려움";

export interface ChallengeStatusProps {
  /** 챌린지 제목 */
  title: string;
  /** 챌린지 설명 */
  description: string;
  /** 난이도 */
  difficulty?: ChallengeDifficulty;
  /** 완료한 일수 */
  completedDays?: number;
  /** 총 일수 */
  totalDays?: number;
  /** 진행률(0-100), 전달 시 우선 사용 */
  progressPercentage?: number;
  /** 종료까지 남은 일수 */
  daysUntilEnd?: number;
  /** 보상 XP */
  rewardXp?: number;
  /** 핀 표시 여부 */
  isPinned?: boolean;
  /** 추가 스타일 */
  className?: string;
  /** 핀 클릭 핸들러 */
  onPinClick?: () => void;
}

export const ChallengeStatus = ({
  title,
  description,
  difficulty = "쉬움",
  completedDays = 7,
  totalDays = 7,
  progressPercentage,
  daysUntilEnd = 3,
  rewardXp = 100,
  isPinned = false,
  className,
  onPinClick,
}: ChallengeStatusProps) => {
  const normalizedProgress =
    typeof progressPercentage === "number"
      ? Math.min(100, Math.max(0, progressPercentage))
      : Math.min(100, Math.max(0, (completedDays / totalDays) * 100));
  const isCompleted = normalizedProgress >= 100 || completedDays >= totalDays;
  const statusLabel = isCompleted ? "성공" : "진행중";

  // 난이도별 스타일 정의
  const difficultyStyles: Record<ChallengeDifficulty, { bg: string; border: string; text: string }> = {
    쉬움: {
      bg: "bg-etc-light-green",
      border: "border-etc-green",
      text: "text-etc-green",
    },
    보통: {
      bg: "bg-etc-light-yellow",
      border: "border-amber-500",
      text: "text-amber-500",
    },
    어려움: {
      bg: "bg-etc-light-red",
      border: "border-etc-red",
      text: "text-etc-red",
    },
  };

  const currentDifficultyStyles = difficulty ? difficultyStyles[difficulty] : difficultyStyles["쉬움"];

  return (
    <article
      className={cn(
        "flex flex-col w-full items-start gap-5 py-[30px] px-5 relative border border-gray-300 border-solid rounded-lg",
        className
      )}
      role="article"
      aria-label={`챌린지: ${title}`}
    >
      {/* 상단 헤더 (핀 아이콘) */}
      <div className="flex h-6 items-center justify-end relative self-stretch w-full">
        <button
          type="button"
          onClick={onPinClick}
          aria-label={isPinned ? "핀 해제" : "핀 고정"}
          className="flex items-center justify-center"
        >
          <PinIcon className="w-6 h-6" ariaLabel={isPinned ? "핀 해제" : "핀 고정"} />
        </button>
      </div>

      {/* 챌린지 정보 */}
      <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
        {/* 제목과 난이도 */}
        <div className="flex gap-5 items-center relative">
          <h2 className="text-Title_M_Medium text-black">{title}</h2>
          <span
            className={cn(
              "inline-flex items-center justify-center gap-2.5 px-2.5 py-0.5 rounded-lg border border-solid",
              currentDifficultyStyles.bg,
              currentDifficultyStyles.border
            )}
          >
            <span
              className={cn(
                "text-Caption_L_Light whitespace-nowrap",
                currentDifficultyStyles.text
              )}
            >
              {difficulty}
            </span>
          </span>
        </div>

        {/* 설명 */}
        <p className="text-Subtitle_S_Regular text-black">{description}</p>

        {/* 진행률 */}
        <div className="flex items-center justify-between relative self-stretch w-full">
          <span className="text-Body_S_Light text-black">진행률</span>
          <span className="text-Body_S_Light text-black text-right">
            {completedDays} / {totalDays}
          </span>
        </div>
      </div>

      {/* 진행률 바 */}
      <div
        className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={completedDays}
        aria-valuemin={0}
        aria-valuemax={totalDays}
        aria-valuetext={`${Math.round(normalizedProgress)}% 완료`}
        aria-label="챌린지 진행률"
      >
        <div
          className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-300"
          style={{ width: `${normalizedProgress}%` }}
        />
      </div>

      {/* 종료일 */}
      <div className="flex items-center relative self-stretch w-full">
        <div className="flex gap-2.5 items-center relative">
          <CalendarIcon className="w-6 h-[26px] text-gray-500" />
          <span className="text-Body_L_Light text-black">{daysUntilEnd}일 후 종료</span>
        </div>
      </div>

      {/* 보상과 상태 */}
      <div className="flex items-start justify-between relative self-stretch w-full">
        <div className="flex gap-1 items-center relative">
          <AwardsIcon className="w-6 h-[26px] text-point-yellow" />
          <span className="text-Body_L_Regular text-black">보상: {rewardXp} XP</span>
        </div>
        <span
          className={cn(
            "px-4 py-2 rounded-lg text-Body_L_Regular",
            isCompleted ? "bg-main-1 text-white" : "bg-gray-100 text-gray-600"
          )}
          aria-label={`상태: ${statusLabel}`}
        >
          {statusLabel}
        </span>
      </div>
    </article>
  );
};
