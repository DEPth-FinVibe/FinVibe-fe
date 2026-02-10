import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const TopOnePercentTraderBadgeIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#D1D5DC",
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
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M22.8642 6.45721C22.9496 6.30217 23.075 6.17289 23.2273 6.08285C23.3797 5.99281 23.5534 5.94531 23.7304 5.94531C23.9074 5.94531 24.0811 5.99281 24.2335 6.08285C24.3858 6.17289 24.5112 6.30217 24.5966 6.45721L30.4345 17.5397C30.5737 17.7964 30.768 18.019 31.0035 18.1916C31.2389 18.3642 31.5097 18.4826 31.7963 18.5382C32.0829 18.5937 32.3783 18.5852 32.6612 18.5131C32.9441 18.441 33.2075 18.3071 33.4326 18.1212L41.8908 10.8752C42.0532 10.7431 42.2533 10.666 42.4623 10.6549C42.6713 10.6438 42.8784 10.6993 43.0538 10.8134C43.2293 10.9275 43.364 11.0943 43.4386 11.2899C43.5132 11.4854 43.5238 11.6996 43.4689 11.9016L37.8644 32.1642C37.75 32.5788 37.5035 32.9449 37.1623 33.2068C36.8212 33.4687 36.4039 33.6123 35.9738 33.6158H11.489C11.0585 33.6127 10.6408 33.4694 10.2992 33.2074C9.95766 32.9454 9.71089 32.5791 9.5964 32.1642L3.99383 11.9035C3.93895 11.7016 3.94957 11.4874 4.02416 11.2919C4.09876 11.0963 4.23348 10.9295 4.40893 10.8154C4.58438 10.7013 4.79151 10.6458 5.00051 10.6569C5.20951 10.668 5.40959 10.7451 5.57196 10.8772L14.0282 18.1231C14.2533 18.3091 14.5167 18.443 14.7996 18.5151C15.0825 18.5872 15.3779 18.5957 15.6645 18.5401C15.9511 18.4846 16.2219 18.3662 16.4573 18.1936C16.6928 18.021 16.8871 17.7983 17.0263 17.5417L22.8642 6.45721Z"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.88867 41.5312H37.5752"
          stroke={color}
          strokeWidth="3.95522"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default TopOnePercentTraderBadgeIcon;


