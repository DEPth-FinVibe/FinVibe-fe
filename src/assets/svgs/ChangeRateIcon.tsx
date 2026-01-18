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
  // 하락 차트
  const down = {
    line: "M17.4167 9.08398L10.3333 2.00065L6.16667 6.16732L0.75 0.750651",
    arrow: "M12.4167 9.08398H17.4167V4.08398",
  };

  // 상승 차트
  const up = {
    line: "M17.4167 0.75L10.3333 7.83333L6.16667 3.66667L0.75 9.08333",
    arrow: "M12.4167 0.75H17.4167V5.75",
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
        width="19"
        height="10"
        viewBox="0 0 19 10"
        fill="none"
        className="w-full h-full"
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d={icon.line}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={icon.arrow}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChangeRateIcon;

