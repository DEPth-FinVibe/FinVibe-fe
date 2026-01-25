import React from "react";
import { cn } from "@/utils/cn";
import LikeIcon from "@/assets/svgs/LikeIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";
import ShareIcon from "@/assets/svgs/ShareIcon";
import Chip from "@/components/Chip";
import AIAnalysisBox from "@/components/AIAnalysisBox";

interface NewsCardProps {
  category: string;
  sentiment: "success" | "error" | "neutral";
  time: string;
  title: string;
  description: string;
  aiAnalysis: string;
  likeCount: number;
  commentCount: number;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  category,
  sentiment,
  time,
  title,
  description,
  aiAnalysis,
  likeCount,
  commentCount,
  className,
}) => {
  const sentimentText =
    sentiment === "success" ? "긍정" : sentiment === "error" ? "부정" : "중립";

  // Note: sentiment chips use special colors that are not part of the standard Chip variants
  // So we apply custom classes for success/error cases in NewsCard
  const sentimentStyles = {
    success: "bg-etc-light-green border-etc-green text-etc-green px-[10px]",
    error: "bg-red-100 border-red-500 text-red-500 px-[10px]",
    neutral: "", // Handled by Chip's neutral variant
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-5 p-[28px_40px] bg-white  rounded-lg w-full",
        className
      )}
    >
      {/* Header Tags */}
      <div className="flex items-center gap-[10px]">
        <Chip label={category} variant="default" />
        <Chip
          label={sentimentText}
          variant={sentiment === "neutral" ? "neutral" : "default"}
          className={cn(sentiment !== "neutral" && sentimentStyles[sentiment])}
        />
        <span className="text-Caption_L_Light text-black">{time}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h3 className="text-Subtitle_L_Medium text-black whitespace-pre-wrap">
          {title}
        </h3>
        <p className="text-Body_L_Light text-black whitespace-pre-wrap">
          {description}
        </p>
      </div>

      {/* AI Analysis Box */}
      <AIAnalysisBox content={aiAnalysis} />

      {/* Footer Actions */}
      <div className="flex gap-12 items-center">
        <div className="flex items-center gap-5">
          <LikeIcon className="w-6 h-6" />
          <span className="text-Subtitle_S_Regular text-black">
            {likeCount}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <CommentIcon className="w-6 h-6" color="#1D1E20" />
          <span className="text-Subtitle_S_Regular text-black">
            {commentCount}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <ShareIcon className="w-6 h-6" />
          <span className="text-Subtitle_S_Regular text-black">공유</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
