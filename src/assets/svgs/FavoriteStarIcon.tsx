import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  /** 즐겨찾기 상태 (true면 노란색으로 채워짐) */
  filled?: boolean;
};

const FavoriteStarIcon: React.FC<Props> = ({ className, onClick, ariaLabel, filled = false }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        className="w-full h-full"
      >
        <path
          d="M10.5 0.5L13.59 6.76L20.5 7.77L15.5 12.64L16.68 19.52L10.5 16.27L4.32 19.52L5.5 12.64L0.5 7.77L7.41 6.76L10.5 0.5Z"
          fill={filled ? "#FFD166" : "none"}
          stroke="#1F3B70"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default FavoriteStarIcon;

