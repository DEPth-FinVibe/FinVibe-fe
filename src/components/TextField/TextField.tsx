import React from "react";
import { cn } from "../../utils/cn";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;

  /** 에러 메시지(있으면 에러 스타일 + 메시지 표시) */
  errorMessage?: string;

  /** 에러 스타일만 주고 메시지는 안 띄우고 싶을 때 */
  hasError?: boolean;

  /** 에러가 아닐 때 안내 문구 */
  helperText?: string;

  leftIcon?: React.ReactNode;

  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  rightIconAriaLabel?: string;

  rightAddon?: React.ReactNode;

  fullWidth?: boolean;

  containerClassName?: string;
  inputClassName?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      errorMessage,
      hasError,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconClick,
      rightIconAriaLabel = "textfield action",
      rightAddon,
      fullWidth = true,
      className,
      containerClassName,
      inputClassName,
      disabled,
      id, // label 연결용
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // errorMessage가 있으면 자동으로 에러 처리 + hasError로 강제 가능
    const error = Boolean(errorMessage) || Boolean(hasError);

    // id가 없으면 label 연결을 위해 자동 생성
    const inputId = React.useId();
    const resolvedId = id ?? inputId;

    // helper/error 텍스트를 스크린리더가 읽을 수 있게 연결
    const helperId = helperText ? `${resolvedId}-help` : undefined;
    const errorId = errorMessage ? `${resolvedId}-error` : undefined;

    // 기존 aria-describedby가 있으면 유지하면서 help/error도 추가
    const describedBy = [
      ariaDescribedBy,
      errorId,
      !error && helperId ? helperId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={cn(fullWidth ? "w-full" : "inline-block", className)}>
        {label && (
          <label
            htmlFor={resolvedId}
            className="block text-Subtitle_S_Regular text-black mb-2.5"
          >
            {label}
          </label>
        )}

        <div className={cn("flex items-center gap-2", containerClassName)}>
          <div className="relative flex-1">
            {leftIcon && (
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              >
                {leftIcon}
              </span>
            )}

            <input
              id={resolvedId}
              ref={ref}
              disabled={disabled}
              aria-invalid={error || undefined}
              aria-describedby={describedBy}
              className={cn(
                "w-full rounded-lg min-h-[28px] py-2.5",
                "bg-gray-100 placeholder:text-black text-Body_M_Light ",
                "border border-transparent",
                "focus:outline-none",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                error && "border-red-400 focus:ring-red-200",
                leftIcon ? "pl-10" : "pl-4",
                rightIcon ? "pr-10" : "pr-4",
                inputClassName
              )}
              {...props}
            />

            {rightIcon && (
              <button
                type="button"
                onClick={onRightIconClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={rightIconAriaLabel}
                disabled={disabled}
              >
                {rightIcon}
              </button>
            )}
          </div>

          {rightAddon && <div className="flex-shrink-0">{rightAddon}</div>}
        </div>

        {/* 에러 우선 표시 */}
        {errorMessage ? (
          <p id={errorId} className="mt-2 text-Caption_L_Light text-red-500">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-2 text-Caption_L_Light text-gray-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = "TextField";
