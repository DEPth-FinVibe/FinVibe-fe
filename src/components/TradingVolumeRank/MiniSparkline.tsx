import { cn } from "@/utils/cn";

interface MiniSparklineProps {
  values: number[];
  className?: string;
  color?: string;
  upColor?: string;
  downColor?: string;
  neutralColor?: string;
  ariaLabel?: string;
}

const MiniSparkline = ({
  values,
  className,
  color,
  upColor = "#FF0000",
  downColor = "#001AFF",
  neutralColor = "#9CA3AF",
  ariaLabel = "일봉 스파크라인",
}: MiniSparklineProps) => {
  const VIEWBOX_WIDTH = 78;
  const VIEWBOX_HEIGHT = 24;
  const PADDING_X = 2;
  const PADDING_Y = 2;
  const validValues = values.filter((v) => Number.isFinite(v));

  if (validValues.length < 2) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className={cn("w-full h-full", className)}
        aria-label={ariaLabel}
      >
        <line
          x1={PADDING_X}
          y1={VIEWBOX_HEIGHT / 2}
          x2={VIEWBOX_WIDTH - PADDING_X}
          y2={VIEWBOX_HEIGHT / 2}
          stroke={neutralColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const first = validValues[0];
  const last = validValues[validValues.length - 1];
  const strokeColor = color ?? (last >= first ? upColor : downColor);

  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  const range = max - min;

  const chartWidth = VIEWBOX_WIDTH - PADDING_X * 2;
  const chartHeight = VIEWBOX_HEIGHT - PADDING_Y * 2;

  const points = validValues.map((value, index) => {
    const x = PADDING_X + (index / (validValues.length - 1)) * chartWidth;
    const y =
      range === 0
        ? VIEWBOX_HEIGHT / 2
        : PADDING_Y + (1 - (value - min) / range) * chartHeight;
    return { x, y };
  });

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const controlX = (prev.x + current.x) / 2;
    path += ` C ${controlX} ${prev.y}, ${controlX} ${current.y}, ${current.x} ${current.y}`;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn("w-full h-full", className)}
      aria-label={ariaLabel}
    >
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default MiniSparkline;
