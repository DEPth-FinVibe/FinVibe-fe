import { cn } from "@/utils/cn";
import Chip from "@/components/Chip/Chip";

export interface MyChallengeHistoryItemProps {
  /** 챌린지 제목 */
  title: string;
  /** 진행률 (0-100) */
  progress: number;
  /** 남은 일수 */
  remainingDays: number;
  /** 보상 XP (칩에 표시) */
  rewardXp?: number;
  /** 종목명 (칩에 표시, rewardXp가 없을 때 사용) */
  stockName?: string;
  /** 추가 스타일 */
  className?: string;
}

export const MyChallengeHistoryItem = ({
  title,
  progress,
  remainingDays,
  rewardXp,
  stockName,
  className,
}: MyChallengeHistoryItemProps) => {
  // 진행률을 0-100 사이로 제한
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // chip에 표시할 텍스트 결정 (rewardXp 우선, 없으면 stockName)
  const chipLabel = rewardXp != null && rewardXp > 0 ? `${rewardXp} XP` : stockName;

  return (
    <article
      className={cn(
        "flex flex-col items-start gap-5 px-[30px] py-[25px] bg-white border border-gray-300 border-solid rounded-lg w-full",
        className
      )}
      role="article"
      aria-label={`챌린지: ${title}`}
    >
      {/* 제목 */}
      <h2 className="text-Subtitle_L_Medium text-black whitespace-pre-wrap">
        {title}
      </h2>

      {/* 진행률 바 */}
      <div
        className="relative w-full h-2"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${Math.round(clampedProgress)}% 완료`}
        aria-label="챌린지 진행률"
      >
        <div className="absolute inset-0 w-full h-full bg-gray-300 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-main-1 rounded-full transition-all duration-300"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>

      {/* 진행률 퍼센트 */}
      <p className="text-Subtitle_M_Regular text-gray-300 whitespace-pre-wrap">
        {Math.round(clampedProgress)}%
      </p>

      {/* 하단 정보 (남은 일수와 보상/종목명) */}
      <div className="flex items-center justify-between relative w-full">
        <p className="text-Body_L_Light text-gray-300 whitespace-pre-wrap">
          {remainingDays}일 남음
        </p>
        {chipLabel && (
          <Chip 
            label={chipLabel} 
            variant="secondary"
            className="!bg-etc-light-mint !border-main-1 !text-[#2E8978]"
          />
        )}
      </div>
    </article>
  );
};

