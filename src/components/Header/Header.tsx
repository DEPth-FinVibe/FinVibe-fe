import React from "react";
import { cn } from "@/utils/cn";
import LogoIcon from "@/assets/logo-icon.svg?react";
import SearchIcon from "@/assets/search.svg?react";
import BellIcon from "@/assets/bell.svg?react";
import UserIcon from "@/assets/user.svg?react";

export interface HeaderProps {
  /** 현재 활성화된 메뉴 이름 */
  activeMenu?: string;
  /** 네비게이션 메뉴 목록 */
  menus?: string[];
  /** 메뉴 클릭 핸들러 */
  onMenuClick?: (menu: string) => void;
  /** 검색 핸들러 */
  onSearch?: (value: string) => void;
  /** 알림 클릭 핸들러 */
  onNotificationClick?: () => void;
  /** 프로필 클릭 핸들러 */
  onProfileClick?: () => void;
  /** 추가 클래스 */
  className?: string;
}

const DEFAULT_MENUS = ["홈", "투자 시뮬레이터", "AI 투자 학습", "뉴스 & 토론", "챌린지"];

/**
 * 이미지 디자인 기반 데스크탑 전용 Header (GNB) 컴포넌트
 */
export const Header: React.FC<HeaderProps> = ({
  activeMenu = "홈",
  menus = DEFAULT_MENUS,
  onMenuClick,
  onSearch,
  onNotificationClick,
  onProfileClick,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between w-full h-[72px] px-8 bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
    >
      {/* 로고 섹션 */}
      <div className="flex items-center gap-2 cursor-pointer shrink-0">
        <LogoIcon className="w-8 h-8" />
        <span className="font-noto text-Headline_S_Bold text-black tracking-tight">
          FinVibe
        </span>
      </div>

      {/* 네비게이션 메뉴 섹션 */}
      <nav className="flex items-center gap-10 mx-10 overflow-x-auto no-scrollbar">
        {menus.map((menu) => (
          <button
            key={menu}
            type="button"
            onClick={() => onMenuClick?.(menu)}
            className={cn(
              "font-noto text-Subtitle_S_Medium whitespace-nowrap transition-colors py-2",
              activeMenu === menu
                ? "text-black font-bold"
                : "text-gray-500 hover:text-black"
            )}
          >
            {menu}
          </button>
        ))}
      </nav>

      {/* 오른쪽 유틸리티 섹션 */}
      <div className="flex items-center gap-4 shrink-0">
        {/* 검색창 */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Search in site"
            className="w-[240px] h-10 pl-10 pr-4 bg-gray-100 border-none rounded-lg font-noto text-Body_M_Light focus:ring-2 focus:ring-teal/20 transition-all outline-none"
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal" />
        </div>

        {/* 알림 버튼 */}
        <button
          type="button"
          onClick={onNotificationClick}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="알림"
        >
          <BellIcon className="w-5 h-5 text-gray-600" />
        </button>

        {/* 프로필 버튼 */}
        <button
          type="button"
          onClick={onProfileClick}
          className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors overflow-hidden"
          aria-label="프로필"
        >
          <UserIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
