import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  /** 아이콘 색상 (기본: #FF0000) */
  color?: string;
};

/**
 * 마이페이지(회원탈퇴 모달 등)에서 사용하는 에러 아이콘
 */
const ErrorIconMyPage: React.FC<Props> = ({ className, color = "#FF0000" }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label="에러"
    >
      <circle cx="9" cy="9" r="8.25" stroke={color} strokeWidth="1.5" />
      <line
        x1="9"
        y1="4.75"
        x2="9"
        y2="10.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="12.75" r="0.75" fill={color} />
    </svg>
  );
};

export default ErrorIconMyPage;


