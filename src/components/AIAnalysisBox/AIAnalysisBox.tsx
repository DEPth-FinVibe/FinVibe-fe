import React from "react";
import { cn } from "@/utils/cn";
import StarIcon from "@/assets/svgs/StarIcon";

export interface AIAnalysisBoxProps {
  /** 분석 내용 */
  content: string;
  /** 추가 스타일 */
  className?: string;
  /** 타이틀에 콜론(:) 포함 여부 */
  showColon?: boolean;
}

export const AIAnalysisBox: React.FC<AIAnalysisBoxProps> = ({
  content,
  className,
  showColon = false,
}) => {
  return (
    <div
      className={cn(
        "flex gap-4 p-5 rounded-lg bg-gradient-to-r from-sub-blue to-sub-gray",
        className
      )}
    >
      <StarIcon className="w-6 h-6 shrink-0" color="#FFFFFF" />
      <div className="flex flex-col gap-2 text-white">
        <span className="text-Subtitle_S_Regular">AI 분석{showColon ? ":" : ""}</span>
        <p className="text-Body_M_Light">{content || "분석 내용이 없습니다."}</p>
      </div>
    </div>
  );
};

export default AIAnalysisBox;
