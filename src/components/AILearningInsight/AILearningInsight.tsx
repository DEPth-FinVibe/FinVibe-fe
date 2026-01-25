import { cn } from "@/utils/cn";
import BrainIcon from "@/assets/svgs/BrainIcon";

export interface AILearningInsightProps {
  /** 추천 학습 제목 */
  title?: string;
  /** 추천 학습 설명 */
  description?: string;
  /** 추가 스타일 */
  className?: string;
}

export const AILearningInsight: React.FC<AILearningInsightProps> = ({
  title = "오늘의 AI 추천 학습",
  description = "최근 거래 패턴을 분석한 결과, \"기술적 분석\" 코스의 RSI와 MACD 강의를 학습하시면 투자 의사결정에 도움이 될 것으로 예상합니다.",
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg p-5 flex flex-col gap-8",
        className
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-5">
        <div className="w-[30px] h-[30px] flex items-center justify-center">
          <BrainIcon className="text-sub-blue" />
        </div>
        <h2 className="text-Subtitle_L_Medium text-black">AI 학습 인사이트</h2>
      </div>

      {/* 추천 학습 박스 */}
      <div className="flex flex-col gap-2">
        <div className="border border-sub-blue rounded-lg p-5 flex flex-col gap-2">
          <p className="text-Subtitle_S_Regular text-sub-blue">{title}</p>
          <p className="text-Body_M_Light text-black whitespace-pre-wrap">{description}</p>
        </div>
      </div>
    </div>
  );
};

