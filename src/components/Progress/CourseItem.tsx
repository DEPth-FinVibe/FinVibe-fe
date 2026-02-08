import { cn } from "@/utils/cn";
import CheckIcon from "@/assets/svgs/CheckIcon";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import type { LessonSummary } from "@/api/study";

export type CourseLevel = "초급" | "중급" | "고급";

export interface CourseItemProps {
  /** 코스 제목 */
  title: string;
  /** 코스 설명 */
  description: string;
  /** 코스 레벨 (초급, 중급, 고급) */
  level?: CourseLevel;
  /** 진행률 (0-100) */
  progress?: number;
  /** 레슨 목록 */
  lessons?: LessonSummary[];
  /** 확장/접기 상태 */
  isExpanded?: boolean;
  /** 추가 스타일 */
  className?: string;
  /** 토글 핸들러 */
  onToggle?: () => void;
  /** 확장/접기 핸들러 */
  onExpand?: () => void;
  /** 레슨 클릭 핸들러 */
  onLessonClick?: (lessonId: number) => void;
}

export const CourseItem = ({
  title,
  description,
  level = "초급",
  progress = 0,
  lessons,
  isExpanded = false,
  className,
  onToggle,
  onExpand,
  onLessonClick,
}: CourseItemProps) => {
  const isCompleted = progress >= 100;

  const handleExpandToggle = () => {
    onExpand?.();
  };

  // 레벨별 스타일 정의 (Figma 디자인 기반)
  const levelStyles: Record<CourseLevel, { bg: string; border: string; text: string }> = {
    초급: {
      bg: "bg-etc-light-green",
      border: "border-etc-green",
      text: "text-etc-green",
    },
    중급: {
      bg: "bg-etc-light-yellow",
      border: "border-amber-500",
      text: "text-amber-500",
    },
    고급: {
      bg: "bg-etc-light-red",
      border: "border-red-500",
      text: "text-red-500",
    },
  };

  const currentLevelStyles = level ? levelStyles[level] : levelStyles["초급"];

  return (
    <article
      className={cn(
        "w-full inline-flex flex-col gap-0 p-5 relative border-b border-gray-400",
        className
      )}
    >
      <div
        className="flex items-start gap-[23px] w-full cursor-pointer"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={handleExpandToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleExpandToggle();
          }
        }}
      >
        <button
          className="relative w-6 h-[26px] flex items-center justify-center"
          aria-label="Toggle course section"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
        >
          <div
            className={cn(
              "relative w-[18px] h-[18px] rounded-full border-[1.5px] border-solid transition-all flex items-center justify-center",
              isCompleted ? "border-etc-green" : "border-gray-400"
            )}
          >
            {isCompleted && (
              <CheckIcon className="text-etc-green" />
            )}
          </div>
        </button>

        <div className="flex flex-col w-full items-start gap-2.5 relative">
          <header className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-start gap-6 relative">
                  <h2 className="w-fit text-Subtitle_M_Regular whitespace-nowrap">
                    {title}
                  </h2>

                  {level && (
                    <span
                      className={cn(
                        "inline-flex items-center justify-center gap-2.5 px-2.5 py-0.5 rounded-lg border border-solid",
                        currentLevelStyles.bg,
                        currentLevelStyles.border
                      )}
                    >
                      <span
                        className={cn(
                          "w-fit text-Caption_L_Light whitespace-nowrap",
                          currentLevelStyles.text
                        )}
                      >
                        {level}
                      </span>
                    </span>
                  )}
                </div>

                <button
                  className="relative w-3.5 h-2 flex items-center justify-center"
                  aria-label={isExpanded ? "접기" : "확장"}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpand?.();
                  }}
                >
                  <ChevronIcon
                    isExpanded={isExpanded}
                    className="w-full h-full"
                    ariaLabel={isExpanded ? "접기" : "확장"}
                  />
                </button>
              </div>

              <p className="self-stretch text-Body_M_Light text-black">
                {description}
              </p>
            </div>
          </header>

          <div className="flex items-end gap-[18px] relative self-stretch w-full flex-[0_0_auto]">
            <div
              className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${Math.round(progress)}% 완료`}
              aria-label="코스 진행률"
            >
              <div
                className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="relative w-7 text-Body_M_Light text-black whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* 레슨 목록 (확장 시) */}
      {isExpanded && lessons && lessons.length > 0 && (
        <div className="mt-4 ml-[47px] flex flex-col gap-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => onLessonClick?.(lesson.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onLessonClick?.(lesson.id);
                }
              }}
            >
              <div
                className={cn(
                  "w-[18px] h-[18px] rounded-full border-[1.5px] border-solid flex items-center justify-center shrink-0",
                  lesson.completed ? "border-etc-green" : "border-gray-400"
                )}
              >
                {lesson.completed && (
                  <CheckIcon className="text-etc-green" />
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span
                  className={cn(
                    "text-Body_S_Light",
                    lesson.completed ? "text-gray-400 line-through" : "text-black"
                  )}
                >
                  {lesson.title}
                </span>
                <span className="text-Caption_L_Light text-gray-400 truncate">
                  {lesson.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};
