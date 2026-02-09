import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
};

const BlackCalendarIcon: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        width="24"
        height="26"
        viewBox="0 0 24 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect
          x="3.75"
          y="6.75"
          width="16.5"
          height="14.5"
          rx="1.25"
          stroke="#1D1E20"
          strokeWidth="1.5"
        />
        <line
          x1="4"
          y1="11.25"
          x2="20"
          y2="11.25"
          stroke="#1D1E20"
          strokeWidth="1.5"
        />
        <line
          x1="8.75"
          y1="4.75"
          x2="8.75"
          y2="8.25"
          stroke="#1D1E20"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="15.25"
          y1="4.75"
          x2="15.25"
          y2="8.25"
          stroke="#1D1E20"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default BlackCalendarIcon;

