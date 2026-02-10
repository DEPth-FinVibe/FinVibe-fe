import { cn } from "@/utils/cn";
import LockIcon from "@/assets/svgs/LockIcon";
import { BADGE_CONFIG, type BadgeType as BadgeConfigType } from "@/components/Badge/badgeConfig";

export type BadgeType =
  | "locked"
  | BadgeConfigType;

export interface BadgeCardProps {
  /** 배지 타입 */
  type: BadgeType;
  /** 배지 제목 */
  title?: string;
  /** 추가 스타일 */
  className?: string;
  /** 커스텀 아이콘 (있으면 기본 아이콘 대신 사용) */
  customIcon?: React.ReactNode;
  /** 획득 여부 (customIcon이 없을 때 BADGE_CONFIG의 아이콘 함수에 전달) */
  isAcquired?: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  type,
  title,
  className,
  customIcon,
  isAcquired = true,
}) => {
  // "locked" 타입 처리
  if (type === "locked") {
    return (
      <div
        className={cn(
          "bg-white rounded-lg p-4 flex flex-col gap-2 items-center justify-center h-[87px] w-[90px]",
          "bg-gray-100",
          className
        )}
      >
        <div className="flex items-center justify-center">
          {customIcon || <LockIcon className="w-6 h-[26px] text-gray-500" />}
        </div>
        <p className="text-Subtitle_S_Regular text-[#4C4C4C] text-center whitespace-pre-wrap leading-tight">
          {title || "미획득"}
        </p>
      </div>
    );
  }

  // BADGE_CONFIG에서 설정 가져오기
  const config = BADGE_CONFIG[type];
  const displayTitle = title || config.displayName;
  const icon = customIcon || config.icon(isAcquired);
  const bg = config.bg;

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-4 flex flex-col gap-2 items-center justify-center h-[87px] w-[90px]",
        bg,
        className
      )}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      <p className="text-Subtitle_S_Regular text-[#4C4C4C] text-center whitespace-pre-wrap leading-tight">
        {displayTitle}
      </p>
    </div>
  );
};

