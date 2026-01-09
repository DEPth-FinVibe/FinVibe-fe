import { cn } from "@/utils/cn";

export interface LectureProgressProps {
  completedLectures?: number;
  totalLectures?: number;
  className?: string;
}

export const LectureProgress = ({
  completedLectures = 8,
  totalLectures = 13,
  className,
}: LectureProgressProps) => {
  const progressPercentage = (completedLectures / totalLectures) * 100;

  return (
    <section
      className={cn(
        "flex flex-col w-full min-w-[432px] items-start gap-5 p-4 relative bg-white rounded-lg",
        className
      )}
      role="region"
      aria-label="강의 진행 상황"
    >
      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <h2 className="relative self-stretch mt-[-1.00px] text-Body_M_Light">
          완료한 강의
        </h2>

        <p
          className="relative self-stretch text-Subtitle_M_Medium"
          aria-label={`완료한 강의 ${completedLectures}개 중 ${totalLectures}개`}
        >
          {completedLectures} / {totalLectures}
        </p>
      </div>

      <div
        className="relative w-full h-1 bg-gray-300 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={completedLectures}
        aria-valuemin={0}
        aria-valuemax={totalLectures}
        aria-valuetext={`${Math.round(progressPercentage)}% 완료`}
        aria-label="강의 진행률"
      >
        <div
          className="absolute top-0 left-0 h-full bg-teal rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </section>
  );
};