import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const BadgeAwardsIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#FFD166", // point-yellow
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
        width="15"
        height="23"
        viewBox="0 0 15 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M7.5 0.75C11.3073 0.75 14.25 3.4994 14.25 6.72266C14.2497 9.94572 11.3071 12.6943 7.5 12.6943C3.69291 12.6943 0.750264 9.94572 0.75 6.72266C0.75 3.4994 3.69274 0.75 7.5 0.75Z"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M11.2936 12.2227L12.9469 21.3743C12.9654 21.4821 12.95 21.5928 12.9028 21.6918C12.8556 21.7907 12.7788 21.8731 12.6827 21.9279C12.5866 21.9828 12.4758 22.0075 12.365 21.9987C12.2543 21.9899 12.1489 21.9481 12.0629 21.8788L8.15624 18.9946C7.96764 18.856 7.73854 18.7811 7.50312 18.7811C7.26771 18.7811 7.0386 18.856 6.85 18.9946L2.93675 21.8777C2.85089 21.9469 2.74563 21.9886 2.63501 21.9974C2.52439 22.0062 2.41368 21.9816 2.31764 21.927C2.2216 21.8723 2.1448 21.79 2.09748 21.6913C2.05017 21.5926 2.03459 21.482 2.05283 21.3743L3.705 12.2227"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default BadgeAwardsIcon;

