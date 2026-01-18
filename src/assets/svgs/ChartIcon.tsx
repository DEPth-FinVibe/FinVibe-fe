import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const ChartIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center cursor-pointer ",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
      >
        <path
          d="M0.75 0.75V14.0833C0.75 14.5254 0.925595 14.9493 1.23816 15.2618C1.55072 15.5744 1.97464 15.75 2.41667 15.75H15.75"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.25 12.4167V5.75"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.08301 12.4165V2.4165"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.91699 12.4165V9.9165"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChartIcon;
