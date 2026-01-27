import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  /** stroke 색상 (미지정 시 currentColor) */
  color?: string;
};

const BagIcon: React.FC<Props> = ({ className, onClick, ariaLabel, color }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="21"
        viewBox="0 0 22 21"
        fill="none"
        className="w-full h-full"
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M14.9198 19.8807V3.09786C14.9198 2.54147 14.7103 2.00787 14.3374 1.61445C13.9645 1.22102 13.4587 1 12.9312 1H8.95405C8.42664 1 7.92084 1.22102 7.5479 1.61445C7.17497 2.00787 6.96545 2.54147 6.96545 3.09786V19.8807"
          stroke={color ?? "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.8974 5.19922H2.9886C1.89033 5.19922 1 6.13846 1 7.29708V17.7864C1 18.945 1.89033 19.8842 2.9886 19.8842H18.8974C19.9956 19.8842 20.886 18.945 20.886 17.7864V7.29708C20.886 6.13846 19.9956 5.19922 18.8974 5.19922Z"
          stroke={color ?? "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default BagIcon;


