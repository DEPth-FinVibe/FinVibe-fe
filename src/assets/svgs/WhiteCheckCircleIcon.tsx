import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

const WhiteCheckCircleIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
}) => {
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
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M32 56C19.3707 56 9 45.3295 9 32C9 18.6705 19.3707 8 32 8C44.6293 8 55 18.6705 55 32C55 45.3295 44.6293 56 32 56Z"
          stroke="white"
          strokeWidth="4"
        />
        <line
          x1="2"
          y1="-2"
          x2="20.152"
          y2="-2"
          transform="matrix(0.677423 -0.735594 0.708499 0.705712 30.6111 42.5195)"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="2"
          y1="-2"
          x2="13.06"
          y2="-2"
          transform="matrix(0.695842 0.718195 -0.690366 0.72346 19.5 32)"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default WhiteCheckCircleIcon;

