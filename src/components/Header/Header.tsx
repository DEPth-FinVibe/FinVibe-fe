import React from "react";
import { cn } from "@/utils/cn";
import { TextField } from "@/components/TextField";
import LogoIcon from "@/assets/svgs/LogoIcon";
import SearchIcon from "@/assets/svgs/SearchIcon";
import BellIcon from "@/assets/svgs/BellIcon";
import UserIcon from "@/assets/svgs/UserIcon";
import { useNavigation } from "@/hooks/useNavigation";
import { MENU_ORDER, getMenuLabel, type MenuKey } from "@/config/routes";

export interface HeaderProps {
  activeMenu?: MenuKey | string; // MenuKey 또는 라벨 (레거시 호환)
  menus?: MenuKey[];
  onMenuClick?: (menu: MenuKey | string) => void;
  onSearch?: (value: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
}

// 기본 메뉴 순서
const DEFAULT_MENUS: MenuKey[] = MENU_ORDER;

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  menus = DEFAULT_MENUS,
  onMenuClick,
  onSearch,
  onNotificationClick,
  onProfileClick,
  className,
}) => {
  const { handleMenuClick, getActiveMenuKey, getActiveMenu, goToHome } = useNavigation();

  // activeMenu가 없으면 현재 경로에서 자동 감지
  const currentActiveMenuKey = activeMenu 
    ? (typeof activeMenu === "string" && activeMenu in MENU_ORDER ? activeMenu : getActiveMenuKey())
    : getActiveMenuKey();
  
  // 활성 메뉴 확인용 (라벨 비교)
  const isMenuActive = (menuKey: MenuKey): boolean => {
    if (typeof activeMenu === "string") {
      // activeMenu가 라벨인 경우
      return getMenuLabel(menuKey) === activeMenu || menuKey === activeMenu;
    }
    return menuKey === currentActiveMenuKey;
  };

  const onMenuButtonClick = (e: React.MouseEvent, menuKey: MenuKey) => {
    e.stopPropagation(); // 이벤트 전파 방지
    
    // 개발 환경에서만 로깅
    if (process.env.NODE_ENV === "development") {
      console.log(`[Header] Menu clicked: ${menuKey} (${getMenuLabel(menuKey)})`);
    }
    
    // 커스텀 핸들러가 있으면 우선 사용
    if (onMenuClick) {
      onMenuClick(menuKey);
      return;
    }
    // 기본 네비게이션 처리
    handleMenuClick(menuKey);
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between w-full h-20 px-8 bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
    >
      {/* 로고 섹션 */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div 
          className="flex items-center justify-center gap-2.5 cursor-pointer"
          onClick={goToHome}
        >
          <LogoIcon />
          <span className="text-Headline_S_Bold text-black">FinVibe</span>
        </div>
        {/* 네비게이션 메뉴 섹션 */}
        <nav className="flex items-center gap-10 mx-10 overflow-x-auto no-scrollbar">
          {menus.map((menuKey) => (
            <button
              key={menuKey}
              type="button"
              onClick={(e) => onMenuButtonClick(e, menuKey)}
              className={cn(
                "text-Subtitle_S_Medium whitespace-nowrap transition-colors py-2",
                isMenuActive(menuKey)
                  ? "text-black font-bold"
                  : "text-gray-2 hover:text-black"
              )}
            >
              {getMenuLabel(menuKey)}
            </button>
          ))}
        </nav>
      </div>

      {/* 오른쪽 유틸리티 섹션 */}
      <div className="flex items-center gap-4 shrink-0">
        {/* 검색창 */}
        <TextField
          size="small"
          placeholder="Search in site"
          fullWidth={false}
          className="w-[240px]"
          containerClassName="group"
          inputClassName="h-10 pl-12 placeholder:text-gray-500 text-Body_M_Regular "
          leftIcon={
            <SearchIcon className="size-5 text-gray-400  transition-colors" />
          }
          onChange={(e) => onSearch?.(e.target.value)}
        />

        {/* 알림 버튼 */}
        <BellIcon onClick={onNotificationClick} ariaLabel="알림" />

        {/* 프로필 버튼 */}
        <UserIcon onClick={onProfileClick} ariaLabel="프로필" className="text-gray-500" />
      </div>
    </header>
  );
};

export default Header;
