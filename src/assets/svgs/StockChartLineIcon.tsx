import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
  /** 차트 방향 (up: 상승, down: 하락) */
  direction?: "up" | "down";
};

const StockChartLineIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#FF0000",
  direction = "up",
}) => {
  const diagonalLength = Math.sqrt(58 * 58 + 33 * 33) + 2; 
  
  const lineTransform = direction === "up" 
    ? "matrix(0.869164 -0.494524 -0.494524 -0.869164 0.3745 33.625)"  // 상승 (상향선)
    : "matrix(-0.869164 -0.494524 -0.494524 0.869164 58.6255 33.625)"; // 하락 (하향선) - y축 반전

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
        width="59"
        height="35"
        viewBox="0 0 59 35"
        fill="none"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        <line
          x1="0"
          y1="-1"
          x2={diagonalLength}
          y2="-1"
          transform={lineTransform}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default StockChartLineIcon;

