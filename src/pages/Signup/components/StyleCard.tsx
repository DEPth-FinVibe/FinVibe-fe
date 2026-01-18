import React from "react";
import { cn } from "@/utils/cn";
import ThunderIcon from "@/assets/svgs/ThunderIcon";
import ChartIcon from "@/assets/svgs/ChartIcon";
import PeopleIcon from "@/assets/svgs/PeopleIcon";
import GraphIcon from "@/assets/svgs/GraphIcon";
import ShieldIcon from "@/assets/svgs/ShieldIcon";
import TargetIcon from "@/assets/svgs/TargetIcon";

export type StyleType = "aggressive" | "growth" | "stable" | "value" | "index" | "social";

interface StyleCardProps {
  type: StyleType;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const getIcon = (type: StyleType, className?: string) => {
  switch (type) {
    case "aggressive": return <ThunderIcon className={className} />;
    case "growth": return <GraphIcon className={className} />;
    case "stable": return <ShieldIcon className={className} />;
    case "value": return <TargetIcon className={className} />;
    case "index": return <ChartIcon className={className} />;
    case "social": return <PeopleIcon className={className} />;
  }
};

const StyleCard: React.FC<StyleCardProps> = ({ type, title, description, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex gap-[16px] items-start px-[10px] py-[16px] rounded-[8px] border border-solid transition-all text-left w-full",
        selected
          ? "bg-[#e8fbf8] border-[#42d6ba]"
          : "bg-white border-[#eaebed] hover:border-[#c7c7c9]"
      )}
    >
      <div className={cn(
        "p-[8px] rounded-[8px] shrink-0",
        selected ? "bg-[#42d6ba]" : "bg-[#eaebed]"
      )}>
        {getIcon(type, cn("size-[24px]", selected ? "text-white" : "text-[#909193]"))}
      </div>
      <div className="flex flex-col gap-[4px] overflow-hidden">
        <p className="text-[14px] font-normal text-black leading-[20px] truncate">{title}</p>
        <p className="text-[10px] font-light text-gray-500 leading-[14px] whitespace-pre-wrap">{description}</p>
      </div>
    </button>
  );
};

export default StyleCard;

