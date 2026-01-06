import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const ThunderIcon: React.FC<Props> = ({ className, onClick, ariaLabel }) => {
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
      >
        <path
          d="M13.5 2.5L4.5 13.5H10.5L9.5 21.5L19.5 10.5H13.5L13.5 2.5Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ThunderIcon;
