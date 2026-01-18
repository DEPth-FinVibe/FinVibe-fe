import React from "react";
import { cn } from "@/utils/cn";
import CloseIcon from "@/assets/svgs/CloseIcon";

export type ChipVariant = "default" | "neutral" | "primary" | "secondary";

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  variant?: ChipVariant;
  className?: string;
  onClose?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  label,
  variant = "default",
  className,
  onClose,
  onClick,
  ...props
}) => {
  const variantStyles: Record<ChipVariant, string> = {
    default:
      "border-gray-300 px-[10px] text-black bg-white rounded-[8px] text-Caption_L_Light",
    neutral:
      "bg-gray-100 border-gray-400 text-gray-400 rounded-[8px] text-Caption_L_Light px-[10px]",
    secondary:
      "border-sub-blue text-sub-blue bg-white rounded-[14px] text-Caption_L_Light px-[10px] py-[4px]",
    primary:
      "bg-sub-blue text-white rounded-[4px] text-Body_M_Light px-4 py-2 border-none",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 border transition-all",
        onClick && "cursor-pointer active:scale-95",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span className="text-sm">{label}</span>
      {onClose && (
        <CloseIcon
          className="size-3 mt-0.5 shrink-0"
          color={variant === "primary" ? "#FFFFFF" : undefined}
          onClick={() => {
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default Chip;
