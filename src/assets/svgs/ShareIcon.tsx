import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const ShareIcon: React.FC<Props> = ({ className, onClick, ariaLabel }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="19"
        viewBox="0 0 17 19"
        fill="none"
      >
        <path
          d="M13.25 5.75C14.6307 5.75 15.75 4.63071 15.75 3.25C15.75 1.86929 14.6307 0.75 13.25 0.75C11.8693 0.75 10.75 1.86929 10.75 3.25C10.75 4.63071 11.8693 5.75 13.25 5.75Z"
          stroke="#1D1E20"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.25 11.75C4.63071 11.75 5.75 10.6307 5.75 9.25C5.75 7.86929 4.63071 6.75 3.25 6.75C1.86929 6.75 0.75 7.86929 0.75 9.25C0.75 10.6307 1.86929 11.75 3.25 11.75Z"
          stroke="#1D1E20"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.25 17.75C14.6307 17.75 15.75 16.6307 15.75 15.25C15.75 13.8693 14.6307 12.75 13.25 12.75C11.8693 12.75 10.75 13.8693 10.75 15.25C10.75 16.6307 11.8693 17.75 13.25 17.75Z"
          stroke="#1D1E20"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5.75 10.75L10.75 14.75"
          stroke="#1D1E20"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.75 3.75L5.75 7.75"
          stroke="#1D1E20"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

export default ShareIcon;
