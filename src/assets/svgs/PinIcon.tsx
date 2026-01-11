import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string; // ex) "#696969"
};

const PinIcon: React.FC<Props> = ({ className, onClick, ariaLabel, color }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      style={color ? { color } : undefined}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 84 84"
        fill="currentColor"
        className="w-6 h-6"
        role="img"
        aria-label={ariaLabel}
      >
        <path d="M27 12H57V18H54V40L60 45V51H45V69H44L43 70L42 71L41 70L40 69H39V51H24V45L30 40V18H27Z" />
      </svg>
    </div>
  );
};

export default PinIcon;
