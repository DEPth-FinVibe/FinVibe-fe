import React from "react";
import { cn } from "@/utils/cn";
import ChartIcon from "@/assets/svgs/ChartIcon";
import CommentIcon from "@/assets/svgs/CommentIcon";

export interface TabOption<T extends string> {
  id: T;
  label: string;
  icon?: (color: string) => React.ReactNode;
}

export interface SwitchBarProps<T extends string> {
  activeTab: T;
  onChange: (tab: T) => void;
  tabs: [TabOption<T>, TabOption<T>]; // 고정된 2개 탭
  className?: string;
}

// 뉴스 페이지용 기본 탭 설정
export type NewsTabType = "news" | "discussion";
export const NEWS_TABS: [TabOption<NewsTabType>, TabOption<NewsTabType>] = [
  {
    id: "news",
    label: "경제 뉴스",
    icon: (color) => <ChartIcon className="w-5 h-5" color={color} />,
  },
  {
    id: "discussion",
    label: "토론 게시판",
    icon: (color) => <CommentIcon className="w-5 h-5" color={color} />,
  },
];

export const SwitchBar = <T extends string>({
  activeTab,
  onChange,
  tabs,
  className,
}: SwitchBarProps<T>) => {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div
      className={cn(
        "relative flex items-center w-full h-[40px] bg-white rounded-[20px] overflow-hidden cursor-pointer p-0.5",
        className
      )}
    >
      {/* Active Tab Background */}
      <div
        className={cn(
          "absolute top-0.5 bottom-0.5 w-[calc(50%-4px)] bg-main-1 rounded-[20px] transition-transform duration-300 ease-in-out shadow-[5px_0px_20px_0px_rgba(0,0,0,0.15)]",
          activeIndex === 0 ? "translate-x-0.5" : "translate-x-full"
        )}
        style={{
          transform: `translateX(${activeIndex === 0 ? "4px" : "calc(100% + 4px)"})`,
        }}
      />

      {/* Tabs */}
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <div
            key={tab.id}
            className={cn(
              "relative z-10 flex-1 flex items-center justify-center h-full gap-2 transition-colors duration-300",
              isActive ? "text-white" : "text-black"
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && tab.icon(isActive ? "#FFFFFF" : "#1D1E20")}
            <span className="text-Subtitle_S_Regular">{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SwitchBar;
