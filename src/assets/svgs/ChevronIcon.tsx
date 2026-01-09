import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  /** 확장 상태 (true면 아래로, false면 위로) */
  isExpanded?: boolean;
};

const ChevronIcon: React.FC<Props> = ({ className, onClick, ariaLabel, isExpanded = false }) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        className={cn(
          "w-full h-full transition-transform duration-200",
          isExpanded && "rotate-180"
        )}
        aria-hidden="true"
      >
        <path
          d="M1 1L7 7L13 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChevronIcon;

