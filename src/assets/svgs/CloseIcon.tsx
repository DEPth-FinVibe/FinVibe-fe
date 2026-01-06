import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  color?: string;
  onClick?: () => void;
};

const CloseIcon: React.FC<Props> = ({
  className,
  color = "#1D1E20",
  onClick,
}) => {
  return (
    <div className={cn("cursor-pointer ", className)} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <line
          x1="0.75"
          y1="-0.75"
          x2="14.25"
          y2="-0.75"
          transform="matrix(0.707107 -0.707107 0.596968 0.802265 1 11.4802)"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="0.75"
          y1="-0.75"
          x2="14.25"
          y2="-0.75"
          transform="matrix(0.707107 0.707107 -0.596968 0.802265 0 0.873535)"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default CloseIcon;
