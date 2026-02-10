import React from "react";
import { cn } from "@/utils/cn";
import LogoIcon from "@/assets/svgs/LogoIcon";
import BellIcon from "@/assets/svgs/BellIcon";
import UserIcon from "@/assets/svgs/UserIcon";

export interface HeaderProps {
  activeMenu?: string;
  menus?: string[];
  onMenuClick?: (menu: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

const DEFAULT_MENUS = [
  "홈",
  "투자 시뮬레이터",
  "AI 투자 학습",
  "뉴스 & 토론",
  "챌린지",
];

export const Header: React.FC<HeaderProps> = ({
  activeMenu = "홈",
  menus = DEFAULT_MENUS,
  onMenuClick,
  onNotificationClick,
  onProfileClick,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between w-full h-20 px-8 bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
    >
      {/* 로고 섹션 */}
      <div className="flex items-center justify-center gap-2.5 cursor-pointer shrink-0">
        <LogoIcon />
        <span className="text-Headline_S_Bold text-black">FinVibe</span>
        {/* 네비게이션 메뉴 섹션 */}
        <nav className="flex items-center gap-10 mx-10 overflow-x-auto no-scrollbar">
          {menus.map((menu) => (
            <button
              key={menu}
              type="button"
              onClick={() => onMenuClick?.(menu)}
              className={cn(
                "text-Subtitle_S_Medium whitespace-nowrap transition-colors py-2",
                activeMenu === menu
                  ? "text-black font-bold"
                  : "text-gray-2 hover:text-black"
              )}
            >
              {menu}
            </button>
          ))}
        </nav>
      </div>

      {/* 오른쪽 유틸리티 섹션 */}
      <div className="flex items-center gap-4 shrink-0">
        {/* 알림 버튼 */}
        <BellIcon onClick={onNotificationClick} ariaLabel="알림" />

        {/* 프로필 버튼 */}
        <UserIcon onClick={onProfileClick} ariaLabel="프로필" className="text-gray-500" />
      </div>
    </header>
  );
};

export default Header;
