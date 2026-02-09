import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const YoutubeIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel = "유튜브",
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
          d="M28.1752 8.025C28.0267 7.43176 27.7243 6.88821 27.2985 6.44926C26.8728 6.0103 26.3387 5.69148 25.7502 5.525C23.6002 5 15.0002 5 15.0002 5C15.0002 5 6.40023 5 4.25023 5.575C3.66179 5.74148 3.1277 6.0603 2.70191 6.49926C2.27612 6.93821 1.97371 7.48176 1.82523 8.075C1.43174 10.2569 1.23927 12.4704 1.25023 14.6875C1.2362 16.9213 1.42869 19.1516 1.82523 21.35C1.98893 21.9248 2.29811 22.4477 2.72291 22.8681C3.1477 23.2885 3.67375 23.5923 4.25023 23.75C6.40023 24.325 15.0002 24.325 15.0002 24.325C15.0002 24.325 23.6002 24.325 25.7502 23.75C26.3387 23.5835 26.8728 23.2647 27.2985 22.8257C27.7243 22.3868 28.0267 21.8432 28.1752 21.25C28.5657 19.0845 28.7581 16.8879 28.7502 14.6875C28.7643 12.4537 28.5718 10.2234 28.1752 8.025Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.1875 18.7746L19.375 14.6871L12.1875 10.5996V18.7746Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default YoutubeIcon;


