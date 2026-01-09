import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const CheckIcon: React.FC<Props> = ({ 
  className, 
  onClick, 
  ariaLabel
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={cn("w-4 h-4", className)}
      >
        <path
          d="M6 12L10 16L18 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CheckIcon;

