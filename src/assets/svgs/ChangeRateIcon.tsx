import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
  /** 차트 방향 (up: 상승, down: 하락) */
  direction?: "up" | "down";
};

const ChangeRateIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#2563EB",
  direction = "up",
}) => {
  // 이미지와 같은 "꺾이는 상승선 + 우상향 화살표(ㄱ자 헤드)" 스타일
  const up = {
    trend: "M2.25 18L9 11.25l3 3L21.75 4.5",
    head: "M21.75 4.5v5.25m0-5.25h-5.25",
  };

  const down = {
    trend: "M2.25 6L9 12.75l3-3L21.75 19.5",
    head: "M21.75 19.5v-5.25m0 5.25h-5.25",
  };

  const icon = direction === "up" ? up : down;

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d={icon.trend}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={icon.head}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChangeRateIcon;

