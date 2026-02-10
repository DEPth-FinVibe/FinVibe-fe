import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const DiligentInvestorBadgeIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#00A63E",
}) => {
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
        width="70"
        height="70"
        viewBox="0 0 70 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M35.9722 58.3327C49.3958 58.3327 60.2777 48.2878 60.2777 35.8968C60.2777 23.5058 49.3958 13.4609 35.9722 13.4609C22.5486 13.4609 11.6666 23.5058 11.6666 35.8968C11.6666 48.2878 22.5486 58.3327 35.9722 58.3327Z"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.9724 49.3586C44.0265 49.3586 50.5557 43.3317 50.5557 35.8971C50.5557 28.4625 44.0265 22.4355 35.9724 22.4355C27.9182 22.4355 21.389 28.4625 21.389 35.8971C21.389 43.3317 27.9182 49.3586 35.9724 49.3586Z"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.9724 40.3845C38.6572 40.3845 40.8336 38.3755 40.8336 35.8973C40.8336 33.4191 38.6572 31.4102 35.9724 31.4102C33.2877 31.4102 31.1113 33.4191 31.1113 35.8973C31.1113 38.3755 33.2877 40.3845 35.9724 40.3845Z"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default DiligentInvestorBadgeIcon;


