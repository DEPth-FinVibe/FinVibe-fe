import { cn } from "@/utils/cn";
import CalendarIcon from "@/assets/svgs/CalendarIcon";
import { Button } from "@/components/Button";

export interface WeeklyEventProps {
  /** 이벤트 제목 */
  title: string;
  /** 이벤트 설명 */
  description?: string;
  /** 날짜 텍스트 (예: "이번 주말") */
  dateLabel?: string;
  /** 보상 정보 (예: "1등 : 1000 XP + 전설 배지") */
  reward?: string;
  /** 추가 스타일 */
  className?: string;
  /** 참가 버튼 클릭 핸들러 */
  onParticipate?: () => void;
}

export const WeeklyEvent = ({
  title,
  description,
  dateLabel = "이번 주말",
  reward,
  className,
  onParticipate,
}: WeeklyEventProps) => {
  return (
    <article
      className={cn(
        "flex flex-col w-full items-start gap-4 p-5 relative bg-etc-light-yellow border-none rounded-lg",
        className
      )}
      role="article"
      aria-label={`주간 이벤트: ${title}`}
    >
      {/* 제목 */}
      <h2 className="text-Subtitle_M_Medium text-black">{title}</h2>

      {/* 설명 */}
      {description && (
        <p className="text-Body_M_Light text-black self-stretch">{description}</p>
      )}

      {/* 하단 정보 영역 */}
      <div className="flex items-center justify-between relative self-stretch w-full">
        {/* 왼쪽: 날짜 표시 */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-300 rounded-lg">
          <CalendarIcon className="w-5 h-5" />
          <span className="text-Body_M_Light text-black">{dateLabel}</span>
        </div>

        {/* 중앙: 보상 정보 */}
        {reward && (
          <div className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
            <span className="text-Body_M_Light">🎁</span>
            <span className="text-Body_M_Light text-black">{reward}</span>
          </div>
        )}

        {/* 오른쪽: 참가 버튼 */}
        {onParticipate && (
          <Button variant="primary" size="small" onClick={onParticipate}>
            참가하기
          </Button>
        )}
      </div>
    </article>
  );
};

