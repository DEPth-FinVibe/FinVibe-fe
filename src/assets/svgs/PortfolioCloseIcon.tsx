import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  color?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

const PortfolioCloseIcon: React.FC<Props> = ({
  className,
  color = "#4C4C4C",
  onClick,
  ariaLabel,
}) => {
  return (
    <div className={cn("cursor-pointer flex items-center justify-center", className)} onClick={onClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
      >
        <line
          y1="-0.75"
          x2="17.9318"
          y2="-0.75"
          transform="matrix(0.688782 -0.724968 0.688782 0.724968 7.14893 18)"
          stroke={color}
          strokeWidth="1.5"
        />
        <line
          y1="-0.75"
          x2="17.9318"
          y2="-0.75"
          transform="matrix(0.688782 0.724968 -0.688782 0.724968 6.5 5)"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default PortfolioCloseIcon;

