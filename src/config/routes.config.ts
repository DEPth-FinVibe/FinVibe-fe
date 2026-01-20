import type { ComponentType } from "react";
import { ROUTES } from "./routes";
import HomePage from "@/pages/Home/HomePage";
import AILearningPage from "@/pages/AILearning/AILearningPage";
import SimulatorPage from "@/pages/Simulator/SimulatorPage";
import NewsPage from "@/pages/News/NewsPage";
import ChallengePage from "@/pages/Challenge/ChallengePage";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import OAuthCallbackPage from "@/pages/OAuthCallback/OAuthCallbackPage";

/**
 * 라우트 설정 타입
 */
export interface RouteConfig {
  path: string;
  component: ComponentType;
  isProtected: boolean; // 인증이 필요한지 여부
  title?: string; // 페이지 제목 (SEO, 브라우저 탭 등)
}

/**
 * 라우트 설정 배열
 * 선언적 방식으로 모든 라우트를 한 곳에서 관리
 */
export const ROUTE_CONFIGS: RouteConfig[] = [
  // 인증이 필요한 라우트
  {
    path: ROUTES.HOME,
    component: HomePage,
    isProtected: true,
    title: "홈",
  },
  {
    path: ROUTES.AI_LEARNING,
    component: AILearningPage,
    isProtected: true,
    title: "AI 투자 학습",
  },
  {
    path: ROUTES.SIMULATOR,
    component: SimulatorPage,
    isProtected: true,
    title: "투자 시뮬레이터",
  },
  {
    path: ROUTES.NEWS,
    component: NewsPage,
    isProtected: true,
    title: "뉴스 & 토론",
  },
  {
    path: ROUTES.CHALLENGE,
    component: ChallengePage,
    isProtected: true,
    title: "챌린지",
  },
  // 인증이 필요 없는 라우트
  {
    path: ROUTES.LOGIN,
    component: LoginPage,
    isProtected: false,
    title: "로그인",
  },
  {
    path: ROUTES.SIGNUP,
    component: SignupPage,
    isProtected: false,
    title: "회원가입",
  },
  {
    path: ROUTES.SIGNUP_OAUTH,
    component: SignupPage,
    isProtected: false,
    title: "OAuth 회원가입",
  },
  {
    path: ROUTES.OAUTH_CALLBACK,
    component: OAuthCallbackPage,
    isProtected: false,
    title: "OAuth 콜백",
  },
];

