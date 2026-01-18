import React from "react";
import { cn } from "@/utils/cn";
import SuccessIcon from "@/assets/svgs/SuccessIcon";
import ErrorIcon from "@/assets/svgs/ErrorIcon";

type TextFieldSize = "small" | "medium" | "large";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** 라벨 텍스트 */
  label?: string;
  /** 텍스트필드 크기 (small / medium / large) */
  size?: TextFieldSize;
  /** 성공 메시지(있으면 성공 스타일 + 메시지 표시) */
  successMessage?: string;
  /** 에러 메시지(있으면 에러 스타일 + 메시지 표시) */
  errorMessage?: string;
  /** 에러 스타일만 주고 메시지는 안 띄우고 싶을 때 */
  hasError?: boolean;
  /** 에러가 아닐 때 안내 문구(예: "영어, 숫자 4-20자") */
  helperText?: string;
  /** 왼쪽 아이콘(예: 유저/자물쇠 아이콘) */
  leftIcon?: React.ReactNode;
  /** 오른쪽 아이콘(예: 비밀번호 보기/숨기기 아이콘) */
  rightIcon?: React.ReactNode;
  /** 오른쪽 아이콘 클릭 핸들러 */
  onRightIconClick?: () => void;
  /** 오른쪽 아이콘 버튼 aria-label(접근성용) */
  rightIconAriaLabel?: string;
  /** 인풋 오른쪽에 붙는 부가 요소(예: 중복확인 버튼) */
  rightAddon?: React.ReactNode;
  /** 버튼/인풋처럼 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 인풋+애드온을 감싸는 컨테이너 클래스 추가 */
  containerClassName?: string;
  /** input 요소에 추가로 붙일 클래스(세부 스타일 커스터마이즈용) */
  inputClassName?: string;
}

const sizeStyles: Record<
  TextFieldSize,
  { label: string; input: string; helper: string; gap: string }
> = {
  // small 높이 가장 낮
  small: {
    label: "text-Subtitle_S_Regular mb-2.5",
    input: "h-[46px] text-Body_M_Light",
    helper: "mt-2 text-Caption_L_Light",
    gap: "gap-2",
  },
  // 높이 중 46 52 56
  medium: {
    label: "text-Subtitle_S_Regular mb-3",
    input: "h-[52px] text-Body_M_Light",
    helper: "mt-2 text-Caption_L_Light",
    gap: "gap-3",
  },
  // 높이 큰
  large: {
    label: "text-Subtitle_M_Regular mb-3",
    input: "h-[56px] text-Body_M_Light",
    helper: "mt-2 text-Caption_L_Light",
    gap: "gap-3",
  },
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      size = "small",
      successMessage,
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
      id,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const error = Boolean(errorMessage) || Boolean(hasError);
    const success = Boolean(successMessage);

    const inputId = React.useId();
    const resolvedId = id ?? inputId;

    const helperId = helperText ? `${resolvedId}-help` : undefined;
    const errorId = errorMessage ? `${resolvedId}-error` : undefined;
    const successId = successMessage ? `${resolvedId}-success` : undefined;

    const describedBy =
      [ariaDescribedBy, error ? errorId : success ? successId : helperId]
        .filter(Boolean)
        .join(" ") || undefined;

    const s = sizeStyles[size];

    return (
      <div className={cn(fullWidth ? "w-full" : "inline-block", className)}>
        {label && (
          <label
            htmlFor={resolvedId}
            className={cn("block text-black", s.label)}
          >
            {label}
          </label>
        )}

        <div className={cn("flex items-center", s.gap, containerClassName)}>
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
                "w-full rounded-lg",
                s.input,
                "bg-gray-100 placeholder:text-black",
                "border border-transparent",
                "focus:outline-none",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                error && "border-red-400 focus:ring-red-200",
                success && "border-green-400 focus:ring-green-200",
                leftIcon ? "pl-10" : "pl-6",
                rightIcon ? "pr-10" : "pr-4",
                inputClassName
              )}
              {...props}
            />

            {rightIcon && (
              <button
                type="button"
                onClick={onRightIconClick}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",
                  onRightIconClick && "hover:text-gray-700",
                  !onRightIconClick && "cursor-default"
                )}
                aria-label={rightIconAriaLabel}
                disabled={disabled || !onRightIconClick}
              >
                {rightIcon}
              </button>
            )}
          </div>

          {rightAddon && <div className="flex-shrink-0">{rightAddon}</div>}
        </div>

        {errorMessage ? (
          <div
            className={cn(s.helper, "flex items-center gap-1.5 text-etc-red")}
          >
            <ErrorIcon className="size-4" />
            <p id={errorId}>{errorMessage}</p>
          </div>
        ) : successMessage ? (
          <div
            className={cn(s.helper, "flex items-center gap-1.5 text-etc-green")}
          >
            <SuccessIcon className="size-4" />
            <p id={successId}>{successMessage}</p>
          </div>
        ) : helperText ? (
          <p id={helperId} className={cn(s.helper, "text-gray-500")}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = "TextField";
