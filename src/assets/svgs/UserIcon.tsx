import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

const UserIcon: React.FC<Props> = ({ className, onClick, ariaLabel }) => {
  return (
    <button
      type="button"
      className={cn("active:scale-95  transition-colors", className)}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M12.2568 12.0068C14.8989 12.1405 17 14.3247 17 17H16.999C16.5403 17.4497 16.0382 17.8547 15.5 18.21V17C15.5 15.067 13.933 13.5 12 13.5H8C6.067 13.5 4.5 15.067 4.5 17V18.21C3.96156 17.8546 3.45886 17.4499 3 17C3 14.2386 5.23858 12 8 12H12L12.2568 12.0068Z"
          fill="currentColor"
        />
        <path
          d="M10 3.75C11.7949 3.75 13.25 5.20507 13.25 7C13.25 8.79493 11.7949 10.25 10 10.25C8.20508 10.25 6.75 8.79492 6.75 7C6.75 5.20508 8.20508 3.75001 10 3.75Z"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <circle cx="10" cy="10" r="9.25" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </button>
  );
};

export default UserIcon;
