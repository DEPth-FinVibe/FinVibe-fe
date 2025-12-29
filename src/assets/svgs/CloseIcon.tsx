import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const CloseIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
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
          stroke="#1D1E20"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <line
          x1="0.75"
          y1="-0.75"
          x2="14.25"
          y2="-0.75"
          transform="matrix(0.707107 0.707107 -0.596968 0.802265 0 0.873535)"
          stroke="#1D1E20"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
  );
};

export default CloseIcon;
