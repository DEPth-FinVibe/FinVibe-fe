import { cn } from "@/utils/cn";
import AwardsIcon from "@/assets/svgs/AwardsIcon";
import { LectureProgress } from "@/components/Progress";

export interface LearningStatsProps {
  /** 완료한 강의 수 */
  completedLectures?: number;
  /** 전체 강의 수 */
  totalLectures?: number;
  /** 총 학습 시간 (분) */
  totalMinutes?: number;
  /** 획득 경험치 */
  experiencePoints?: number;
  /** 추가 스타일 */
  className?: string;
}

export const LearningStats: React.FC<LearningStatsProps> = ({
  completedLectures = 8,
  totalLectures = 13,
  totalMinutes = 225, // 3시간 45분
  experiencePoints = 850,
  className,
}) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div
      className={cn(
        "bg-white rounded-lg p-5 flex flex-col gap-5",
        className
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-5">
        <div className="w-[30px] h-[30px] flex items-center justify-center">
          <AwardsIcon className="text-point-yellow" />
        </div>
        <h2 className="text-Subtitle_L_Medium text-black">학습 통계</h2>
      </div>

      {/* 통계 항목들 */}
      <div className="flex flex-col gap-[15px]">
        {/* 완료한 강의 */}
        <LectureProgress
          completedLectures={completedLectures}
          totalLectures={totalLectures}
          className="border border-gray-400 rounded-lg"
        />

        {/* 총 학습 시간 */}
        <div className="border border-gray-400 rounded-lg p-4 flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-Body_M_Light text-black">총 학습 시간</p>
            <p className="text-Subtitle_M_Medium text-main-1">
              {hours}시간 {minutes}분
            </p>
          </div>
        </div>

        {/* 획득 경험치 */}
        <div className="border border-gray-400 rounded-lg p-4 flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-Body_M_Light text-black">획득 경험치</p>
            <p className="text-Subtitle_M_Medium text-main-1">
              {experiencePoints} XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

