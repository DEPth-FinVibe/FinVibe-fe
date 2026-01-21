import React from "react";
import { cn } from "@/utils/cn";

export interface PopularDiscussionItem {
  title: string;
  commentCount: number;
}

export interface PopularDiscussionSectionProps {
  discussions: PopularDiscussionItem[];
  className?: string;
}

export const PopularDiscussionSection: React.FC<PopularDiscussionSectionProps> = ({
  discussions,
  className,
}) => {
  return (
    <div className={cn("bg-white rounded-lg p-5", className)}>
      <h3 className="text-Subtitle_M_Medium text-black mb-5">인기 토론</h3>
      <div className="flex flex-col gap-4">
        {discussions.map((discussion, index) => (
          <div
            key={index}
            className="cursor-pointer hover:text-main-1 transition-colors"
          >
            <p className="text-Body_M_Light text-black">{discussion.title}</p>
            <p className="text-Caption_L_Light text-gray-400">
              댓글 {discussion.commentCount}개
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDiscussionSection;
