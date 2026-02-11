import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const ChallengeCompletedIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#42D6BA",
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
        width="47"
        height="45"
        viewBox="0 0 47 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M22.3364 41.5C12.4977 41.5 4.50049 33.4531 4.50049 23.5C4.50049 13.5469 12.4977 5.5 22.3364 5.5C32.175 5.5001 40.1724 13.547 40.1724 23.5C40.1724 33.453 32.175 41.4999 22.3364 41.5Z"
          fill="#C7F3EB"
          stroke={color}
          strokeWidth="3"
        />
        <line
          x1="1.5"
          y1="-1.5"
          x2="15.3543"
          y2="-1.5"
          transform="matrix(0.688638 -0.725105 0.719273 0.694727 21.262 31.3887)"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="1.5"
          y1="-1.5"
          x2="9.96733"
          y2="-1.5"
          transform="matrix(0.706811 0.707403 -0.701413 0.712755 12.668 23.5)"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default ChallengeCompletedIcon;

