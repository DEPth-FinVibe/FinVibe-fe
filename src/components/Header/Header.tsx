import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import LogoIcon from "@/assets/svgs/LogoIcon";
import UserIcon from "@/assets/svgs/UserIcon";

export interface HeaderProps {
  activeMenu?: string;
  menus?: string[];
  onMenuClick?: (menu: string) => void;
  /**
   * 메뉴 라벨 -> 경로 매핑. 전달하면 각 메뉴를 실제 <a> 링크로 렌더링해
   * 새 탭으로 열기, 링크 복사, 스크린리더 탐색이 가능해진다.
   * 전달하지 않으면 기존처럼 button으로 렌더링한다(Storybook 등 Router 밖 사용).
   */
  menuRoutes?: Record<string, string>;
  onProfileClick?: () => void;
  /** 로그인 여부. false면 프로필 대신 로그인 버튼을 노출 */
  isLoggedIn?: boolean;
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
  menuRoutes,
  onProfileClick,
  isLoggedIn = true,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between w-full h-20 px-8 bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
    >
      <div className="flex items-center gap-2.5 shrink-0">
        {/* 로고 섹션 */}
        <div className="flex items-center gap-2.5">
          <LogoIcon />
          <span className="text-Headline_S_Bold text-black">FinVibe</span>
        </div>

        {/* 네비게이션 메뉴 섹션 */}
        <nav className="flex items-center gap-10 mx-10 overflow-x-auto no-scrollbar">
          {menus.map((menu) => {
            const menuClassName = cn(
              "text-Subtitle_S_Medium whitespace-nowrap transition-colors py-2",
              activeMenu === menu
                ? "text-black font-bold"
                : "text-gray-2 hover:text-black"
            );
            const route = menuRoutes?.[menu];

            // 경로를 알면 실제 링크로 렌더링한다
            return route ? (
              <Link
                key={menu}
                to={route}
                aria-current={activeMenu === menu ? "page" : undefined}
                onClick={() => onMenuClick?.(menu)}
                className={menuClassName}
              >
                {menu}
              </Link>
            ) : (
              <button
                key={menu}
                type="button"
                onClick={() => onMenuClick?.(menu)}
                className={menuClassName}
              >
                {menu}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 오른쪽 유틸리티 섹션 */}
      <div className="flex items-center gap-4 shrink-0">
        {/* 로그인 상태: 프로필 버튼 / 비로그인 상태: 로그인 버튼 */}
        {isLoggedIn ? (
          <UserIcon onClick={onProfileClick} ariaLabel="프로필" className="text-gray-500" />
        ) : (
          <button
            type="button"
            onClick={onProfileClick}
            className="px-4 py-2 rounded-lg bg-main-1 text-white text-Body_M_Light hover:bg-main-2 transition-colors whitespace-nowrap"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
