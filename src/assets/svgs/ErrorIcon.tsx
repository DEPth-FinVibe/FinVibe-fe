import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const ErrorIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
    >
      <circle cx="12" cy="12" r="9" fill="#DC2626" />
      <path
        d="M9 9L15 15M15 9L9 15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ErrorIcon;

