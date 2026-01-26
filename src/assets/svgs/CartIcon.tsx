import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  /** stroke/fill 색상 (미지정 시 currentColor) */
  color?: string;
};

const CartIcon: React.FC<Props> = ({ className, onClick, ariaLabel, color }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
        aria-label={ariaLabel}
      >
        <path
          d="M3 4H5L7.4 16.2C7.49 16.66 7.86 17 8.33 17H17.6C18.05 17 18.42 16.69 18.52 16.25L20 8H6.1"
          stroke={color ?? "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="9"
          cy="20"
          r="1.5"
          fill={color ?? "currentColor"}
        />
        <circle
          cx="17"
          cy="20"
          r="1.5"
          fill={color ?? "currentColor"}
        />
      </svg>
    </div>
  );
};

export default CartIcon;


