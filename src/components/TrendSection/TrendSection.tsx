import React from "react";
import { cn } from "@/utils/cn";
import LineChartIcon from "@/assets/svgs/LineChartIcon";

export interface TrendItem {
  tag: string;
  count: number;
}

export interface TrendSectionProps {
  trends: TrendItem[];
  className?: string;
}

export const TrendSection: React.FC<TrendSectionProps> = ({ trends, className }) => {
  return (
    <div className={cn("bg-white rounded-lg p-5", className)}>
      <div className="flex items-center gap-2 mb-5">
        <LineChartIcon className="w-5 h-5 text-main-1" />
        <h3 className="text-Subtitle_M_Medium text-black">실시간 트렌드</h3>
      </div>
      <div className="flex flex-col gap-3">
        {trends.map((trend) => (
          <div
            key={trend.tag}
            className="flex justify-between items-center py-2 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <span className="text-Body_M_Medium text-black">{trend.tag}</span>
            <span className="border border-gray-200 rounded-lg px-2 py-1 text-Body_S_Light text-gray-400">
              {trend.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendSection;
