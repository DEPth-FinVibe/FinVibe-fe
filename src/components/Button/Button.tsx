import React from "react";
import { cn } from "../../utils/cn";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 스타일 변형 (primary: 활성, secondary: 비활성) */
  variant?: ButtonVariant;
  /** 버튼의 크기 */
  size?: ButtonSize;
  /** 버튼 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 버튼 내용 */
  children: React.ReactNode;
  /** 아이콘 (왼쪽에 표시) */
  leftIcon?: React.ReactNode;
  /** 아이콘 (오른쪽에 표시) */
  rightIcon?: React.ReactNode;
}

/**
 * 재사용 가능한 Button 컴포넌트
 *
 * Figma 디자인 시스템에 기반한 버튼 컴포넌트입니다.
 * - primary: 검은색 배경, 흰색 텍스트 (활성 상태)
 * - secondary: 흰색 배경, 회색 테두리, 검은색 텍스트 (비활성 상태)
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const getVariantStyles = () => {
    if (variant === "primary") {
      return size === "large"
        ? "bg-teal text-white border-teal hover:bg-teal-light active:bg-teal-light"
        : "bg-black text-white border-black hover:bg-gray-800 active:bg-gray-900";
    }
    return "bg-white text-black border-gray-200 hover:bg-gray-50 active:bg-gray-100";
  };

  const sizeStyles = {
    small: "px-3 py-1.5 text-xs leading-4 min-h-[28px]",
    medium: "px-[87px] py-3 text-sm leading-5 min-h-[36px]",
    large: "px-6 py-4 text-base leading-6 min-h-[48px]",
  };

  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center",
        "font-noto font-light text-center",
        "whitespace-nowrap",
        "cursor-pointer select-none",
        "border border-solid rounded",
        "transition-all duration-200 ease-in-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        getVariantStyles(),
        sizeStyles[size],
        fullWidth && "w-full",
        loading && "pointer-events-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="inline-flex items-center justify-center mr-2"
          aria-hidden="true"
        >
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      {!loading && leftIcon && (
        <span
          className="inline-flex items-center justify-center mr-2 flex-shrink-0"
          aria-hidden="true"
        >
          {leftIcon}
        </span>
      )}
      <span className="flex flex-col justify-center">{children}</span>
      {!loading && rightIcon && (
        <span
          className="inline-flex items-center justify-center ml-2 flex-shrink-0"
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;

