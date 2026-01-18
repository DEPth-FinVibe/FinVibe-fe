import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const GraphIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
    >
      <path
        d="M3 21H21M3 18L7 12L11 15L16 6L21 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default GraphIcon;

