import React from "react";
import { cn } from "@/utils/cn";

export interface HeaderProps {
  /** 헤더 제목 */
  title?: string;
  /** 왼쪽 아이콘 (예: 뒤로 가기) */
  leftIcon?: React.ReactNode;
  /** 오른쪽 아이콘 (예: 닫기) */
  rightIcon?: React.ReactNode;
  /** 왼쪽 아이콘 클릭 핸들러 */
  onLeftClick?: () => void;
  /** 오른쪽 아이콘 클릭 핸들러 */
  onRightClick?: () => void;
  /** 추가 클래스 */
  className?: string;
}

/**
 * Figma 디자인 시스템 기반 Header 컴포넌트
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftClick,
  onRightClick,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between h-[56px] px-4 bg-white border-b border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-start w-10">
        {leftIcon && (
          <button
            type="button"
            onClick={onLeftClick}
            className="p-1 -ml-1 hover:opacity-70 transition-opacity"
            aria-label="왼쪽 버튼"
          >
            {leftIcon}
          </button>
        )}
      </div>

      <h1 className="flex-1 text-center font-noto text-Subtitle_S_Medium text-black truncate px-2">
        {title}
      </h1>

      <div className="flex items-center justify-end w-10">
        {rightIcon && (
          <button
            type="button"
            onClick={onRightClick}
            className="p-1 -mr-1 hover:opacity-70 transition-opacity"
            aria-label="오른쪽 버튼"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
