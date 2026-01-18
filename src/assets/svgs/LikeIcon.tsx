import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const LikeIcon: React.FC<Props> = ({ className, onClick, ariaLabel }) => {
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
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
      >
        <path
          d="M4.27979 6.75049V15.7502"
          stroke="#1D1E20"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.92801 3.6599L9.22201 6.74978H13.338C13.5572 6.74978 13.7734 6.804 13.9695 6.90814C14.1655 7.01227 14.3361 7.16347 14.4676 7.34976C14.5991 7.53605 14.688 7.75231 14.7272 7.98141C14.7664 8.21051 14.7549 8.44617 14.6935 8.66971L13.0485 14.6695C12.963 14.9811 12.7846 15.2547 12.5402 15.4495C12.2958 15.6442 11.9985 15.7495 11.693 15.7495H2.162C1.78752 15.7495 1.42837 15.5914 1.16357 15.3101C0.898764 15.0288 0.75 14.6473 0.75 14.2495V8.24973C0.75 7.85192 0.898764 7.4704 1.16357 7.18911C1.42837 6.90781 1.78752 6.74978 2.162 6.74978H4.11057C4.37326 6.74964 4.6307 6.67165 4.85395 6.52458C5.0772 6.37752 5.25741 6.16721 5.37431 5.91731L7.81001 0.75C8.14294 0.75438 8.47064 0.838624 8.76862 0.996438C9.0666 1.15425 9.32716 1.38156 9.53082 1.66137C9.73449 1.94118 9.87599 2.26627 9.94477 2.61233C10.0136 2.9584 10.0078 3.31651 9.92801 3.6599Z"
          stroke="#1D1E20"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LikeIcon;
