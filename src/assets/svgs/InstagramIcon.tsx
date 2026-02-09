import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const InstagramIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel = "인스타그램",
  color = "black",
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
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M21.25 2.5H8.75C5.29822 2.5 2.5 5.29822 2.5 8.75V21.25C2.5 24.7018 5.29822 27.5 8.75 27.5H21.25C24.7018 27.5 27.5 24.7018 27.5 21.25V8.75C27.5 5.29822 24.7018 2.5 21.25 2.5Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.0001 14.2119C20.1544 15.2522 19.9767 16.3147 19.4923 17.2482C19.0079 18.1817 18.2416 18.9387 17.3022 19.4115C16.3628 19.8843 15.2982 20.0489 14.2599 19.8818C13.2215 19.7147 12.2623 19.2245 11.5187 18.4809C10.775 17.7372 10.2848 16.778 10.1177 15.7397C9.95063 14.7013 10.1152 13.6368 10.588 12.6974C11.0609 11.758 11.8179 10.9916 12.7514 10.5072C13.6849 10.0228 14.7473 9.84514 15.7876 9.9994C16.8488 10.1568 17.8312 10.6512 18.5897 11.4098C19.3483 12.1683 19.8428 13.1507 20.0001 14.2119Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.875 8.125H21.8872"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default InstagramIcon;


