import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const SuccessIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
    >
      <circle cx="12" cy="12" r="9" fill="#16A34A" />
      <path
        d="M8.5 12.5L10.5 14.5L15.5 9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SuccessIcon;

