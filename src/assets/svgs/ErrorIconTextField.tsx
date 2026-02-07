import React from "react";
import { cn } from "@/utils/cn";

export type Props = {
  className?: string;
  /** 아이콘 색상 (기본: #FF0000) */
  color?: string;
};

/**
 * TextField에서 사용하는 에러 아이콘
 *
 * NOTE: 현재 레포에는 "이전 TextField용 아이콘" 소스가 남아있지 않아,
 *       우선 마이페이지용과 파일을 분리만 해둔 상태입니다.
 *       이전 SVG를 주시면 이 파일의 SVG만 교체해서 적용합니다.
 */
const ErrorIconTextField: React.FC<Props> = ({ className, color = "#FF0000" }) => {
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

export default ErrorIconTextField;


