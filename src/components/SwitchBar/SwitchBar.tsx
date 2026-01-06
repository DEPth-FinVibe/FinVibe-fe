import React from "react";
import { cn } from "@/utils/cn";
import ChartIcon from "@/assets/svgs/ChartIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";

export type TabType = "news" | "discussion";

export interface SwitchBarProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  className?: string;
}

const SwitchBar: React.FC<SwitchBarProps> = ({
  activeTab,
  onChange,
  className,
}) => {
  const handleToggle = () => {
    onChange(activeTab === "news" ? "discussion" : "news");
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-[978px] h-[40px] bg-white rounded-[20px] overflow-hidden border border-gray-300 cursor-pointer",
        className
      )}
      onClick={handleToggle}
    >
      {/* Active Tab Background */}
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-1/2 bg-main-1 rounded-[20px] transition-transform duration-300 ease-in-out shadow-[5px_0px_20px_0px_rgba(0,0,0,0.15)]",
          activeTab === "news" ? "translate-x-0" : "translate-x-full"
        )}
      />

      {/* Tabs */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center w-1/2 h-full gap-2 transition-colors duration-300",
          activeTab === "news" ? "text-white" : "text-black"
        )}
      >
        <ChartIcon
          className="w-5 h-5"
          color={activeTab === "news" ? "#FFFFFF" : "#1D1E20"}
        />
        <span className="text-Subtitle_S_Regular">경제 뉴스</span>
      </div>

      <div
        className={cn(
          "relative z-10 flex items-center justify-center w-1/2 h-full gap-2 transition-colors duration-300",
          activeTab === "discussion" ? "text-white" : "text-black"
        )}
      >
        <CommentIcon
          className="w-5 h-5"
          color={activeTab === "discussion" ? "#FFFFFF" : "#1D1E20"}
        />
        <span className="text-Subtitle_S_Regular">토론 게시판</span>
      </div>
    </div>
  );
};

export default SwitchBar;

