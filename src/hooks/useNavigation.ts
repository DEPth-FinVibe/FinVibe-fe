import { useNavigate, useLocation } from "react-router-dom";
import { MENUS, getMenuKeyFromPath, getMenuPath, getMenuLabel, type MenuKey } from "@/config/routes";

/* 네비게이션 관련 로직을 관리하는 커스텀 훅 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * 메뉴 클릭 시 해당 경로로 이동
   * @param menu - MenuKey 또는 라벨 문자열 (레거시 호환)
   */
  const handleMenuClick = (menu: MenuKey | string) => {
    let menuKey: MenuKey | undefined;
    let route: string | undefined;

    // MenuKey인지 확인
    if (menu in MENUS) {
      menuKey = menu as MenuKey;
      route = getMenuPath(menuKey);
    } else {
      // 라벨로 찾기 (레거시 호환)
      const found = Object.entries(MENUS).find(([, m]) => m.label === menu);
      if (found) {
        menuKey = found[0] as MenuKey;
        route = found[1].path;
      }
    }

    if (route && menuKey) {
      // 개발 환경에서만 로깅
      if (process.env.NODE_ENV === "development") {
        console.log(`[Navigation] handleMenuClick - key: ${menuKey}, label: ${getMenuLabel(menuKey)}, route: ${route}`);
      }
      navigate(route);
    } else {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[Navigation] Invalid menu: ${menu}`);
      }
    }
  };

  /* 현재 경로에 해당하는 활성 메뉴 키 반환 */
  const getActiveMenuKey = (): MenuKey => {
    return getMenuKeyFromPath(location.pathname) || "HOME";
  };

  /* 현재 경로에 해당하는 활성 메뉴 라벨 반환 (레거시 호환) */
  const getActiveMenu = (): string => {
    const key = getActiveMenuKey();
    return getMenuLabel(key);
  };

  /* 홈으로 이동 */
  const goToHome = () => {
    navigate(getMenuPath("HOME"));
  };

  return {
    handleMenuClick,
    getActiveMenu,
    getActiveMenuKey,
    goToHome,
    currentPath: location.pathname,
  };
};

