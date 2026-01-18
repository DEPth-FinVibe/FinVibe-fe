import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
  /** 차트 방향 (up: 상승, down: 하락) */
  direction?: "up" | "down";
};

const LineChartIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#FF0000",
  direction = "up",
}) => {
  // 상승 차트
  // 하락 차트
  const path = direction === "up" 
    ? "M0.500062 23.4989L68.2474 1.43383"  // 왼쪽 아래에서 오른쪽 위로
    : "M0.500062 0.501108L68.2474 22.5662"; // 왼쪽 위에서 오른쪽 아래로

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
        width="69"
        height="24"
        viewBox="0 0 69 24"
        fill="none"
        className="w-full h-full"
      >
        <path
          d={path}
          stroke={color}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default LineChartIcon;

