import React from "react";
import { cn } from "@/utils/cn";
import GrayProfileIcon from "@/assets/svgs/GrayProfileIcon";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";

export type ServiceRankingRowModel = {
  rank: number;
  name: string;
  changeRateText: string; // 예: +28.3%
  amountText: string; // 예: 000,000
  variant: "top3" | "normal";
};

type Props = {
  item: ServiceRankingRowModel;
  onClick?: (item: ServiceRankingRowModel) => void;
};

const medalEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return String(rank);
};

const ServiceRankingRow: React.FC<Props> = ({ item, onClick }) => {
  const isTop3 = item.variant === "top3";
  const clickable = Boolean(onClick);

  return (
    <div
      className={cn(
        "w-full rounded-2xl",
        "flex items-center justify-between",
        "px-10 py-5",
        isTop3
          ? "bg-etc-light-navy border border-sub-blue"
          : "bg-white border border-gray-300",
        clickable && "cursor-pointer"
      )}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onClick?.(item) : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(item);
              }
            }
          : undefined
      }
    >
      <div className="flex items-center gap-5">
        <p className="w-5 text-Subtitle_L_Medium text-black whitespace-pre-wrap">
          {medalEmoji(item.rank)}
        </p>

        <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
          <GrayProfileIcon className="w-6 h-[26px]" ariaLabel="프로필" />
        </div>

        <div className="flex items-center gap-1">
          <p className="text-Subtitle_L_Medium text-black">{item.name}</p>
          {isTop3 && (
            <BadgeAwardsIcon className="w-5 h-5 text-black" />
          )}
        </div>
      </div>

      <div
        className={cn(
          "text-right whitespace-nowrap",
          isTop3 ? "text-[20px] leading-[25px]" : "text-[20px] leading-[25px]",
          "text-etc-red"
        )}
      >
        <p className="mb-0">{item.changeRateText}</p>
        <p>{item.amountText}</p>
      </div>
    </div>
  );
};

export default ServiceRankingRow;


