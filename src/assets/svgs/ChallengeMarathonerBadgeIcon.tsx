import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const ChallengeMarathonerBadgeIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#C7C7C9",
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
          d="M53.4723 38.1414C53.4723 49.3594 44.9653 54.9684 34.8542 58.2216C34.3247 58.3872 33.7496 58.3793 33.2257 58.1991C23.0903 54.9684 14.5834 49.3594 14.5834 38.1414V22.4363C14.5834 21.8413 14.8395 21.2706 15.2953 20.8498C15.7511 20.4291 16.3693 20.1927 17.0139 20.1927C21.875 20.1927 27.9514 17.5004 32.1806 14.0902C32.6955 13.6841 33.3506 13.4609 34.0278 13.4609C34.7051 13.4609 35.3601 13.6841 35.875 14.0902C40.1285 17.5228 46.1806 20.1927 51.0417 20.1927C51.6863 20.1927 52.3046 20.4291 52.7604 20.8498C53.2162 21.2706 53.4723 21.8413 53.4723 22.4363V38.1414Z"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ChallengeMarathonerBadgeIcon;


