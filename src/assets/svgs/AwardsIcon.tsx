import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const AwardsIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#FFD166",
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
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <circle
          cx="15"
          cy="10"
          r="5.25"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M19.173 14L20.9916 24.2956C21.012 24.4168 20.9951 24.5414 20.9431 24.6527C20.8912 24.764 20.8067 24.8567 20.701 24.9185C20.5953 24.9802 20.4734 25.0079 20.3516 24.998C20.2297 24.9882 20.1138 24.9411 20.0193 24.8632L15.7219 21.6185C15.5145 21.4625 15.2624 21.3783 15.0035 21.3783C14.7445 21.3783 14.4925 21.4625 14.2851 21.6185L9.98047 24.8619C9.88603 24.9398 9.77024 24.9867 9.64856 24.9966C9.52688 25.0065 9.4051 24.9789 9.29945 24.9173C9.1938 24.8558 9.10932 24.7633 9.05728 24.6522C9.00523 24.5411 8.9881 24.4167 9.00816 24.2956L10.8255 14"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default AwardsIcon;
