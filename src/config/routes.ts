// 라우트 경로 상수 정의
export const ROUTES = {
  HOME: "/",
  SIMULATOR: "/simulator",
  AI_LEARNING: "/ai-learning",
  NEWS: "/news",
  CHALLENGE: "/challenge",
  LOGIN: "/login",
  SIGNUP: "/signup",
  SIGNUP_OAUTH: "/signup/oauth",
  OAUTH_CALLBACK: "/oauth/callback",
} as const;

// 메뉴 정의
export const MENUS = {
  HOME: { label: "홈", path: ROUTES.HOME },
  SIMULATOR: { label: "투자 시뮬레이터", path: ROUTES.SIMULATOR },
  AI_LEARNING: { label: "AI 투자 학습", path: ROUTES.AI_LEARNING },
  NEWS: { label: "뉴스 & 토론", path: ROUTES.NEWS },
  CHALLENGE: { label: "챌린지", path: ROUTES.CHALLENGE },
} as const;

// 메뉴 키 타입 정의
export type MenuKey = keyof typeof MENUS;

// 메뉴 순서 정의
export const MENU_ORDER: MenuKey[] = [
  "HOME",
  "SIMULATOR",
  "AI_LEARNING",
  "NEWS",
  "CHALLENGE",
];

// 메뉴 키로부터 라벨 가져오기
export const getMenuLabel = (key: MenuKey): string => {
  return MENUS[key].label;
};

// 메뉴 키로부터 경로 가져오기
export const getMenuPath = (key: MenuKey): string => {
  return MENUS[key].path;
};

// 경로로부터 메뉴 키 찾기 (정확한 매칭)
export const getMenuKeyFromPath = (pathname: string): MenuKey | undefined => {
  // 정확한 경로 매칭
  for (const [key, menu] of Object.entries(MENUS)) {
    if (menu.path === pathname) {
      return key as MenuKey;
    }
  }

  // 하위 경로 매칭 (예: /ai-learning/123 -> AI_LEARNING)
  for (const [key, menu] of Object.entries(MENUS)) {
    if (pathname.startsWith(menu.path + "/") || pathname === menu.path) {
      return key as MenuKey;
    }
  }

  return undefined;
};
