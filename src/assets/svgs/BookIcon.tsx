import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

const BookIcon: React.FC<Props> = ({
  className,
  onClick,
  ariaLabel,
  color = "#001AFF",
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
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="16"
        viewBox="0 0 20 16"
        fill="none"
        className={cn("w-full h-full", className)}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d="M9.75 3.75V14.75"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.65 12.4167C1.41131 12.4167 1.18239 12.3347 1.0136 12.1889C0.844821 12.043 0.75 11.8452 0.75 11.6389V1.52778C0.75 1.3215 0.844821 1.12367 1.0136 0.977806C1.18239 0.831944 1.41131 0.75 1.65 0.75H6.15C7.10478 0.75 8.02045 1.07778 8.69558 1.66122C9.37072 2.24467 9.75 3.03599 9.75 3.86111C9.75 3.03599 10.1293 2.24467 10.8044 1.66122C11.4795 1.07778 12.3952 0.75 13.35 0.75H17.85C18.0887 0.75 18.3176 0.831944 18.4864 0.977806C18.6552 1.12367 18.75 1.3215 18.75 1.52778V11.6389C18.75 11.8452 18.6552 12.043 18.4864 12.1889C18.3176 12.3347 18.0887 12.4167 17.85 12.4167H12.45C11.7339 12.4167 11.0472 12.6625 10.5408 13.1001C10.0345 13.5377 9.75 14.1312 9.75 14.75C9.75 14.1312 9.46554 13.5377 8.95919 13.1001C8.45284 12.6625 7.76608 12.4167 7.05 12.4167H1.65Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default BookIcon;
