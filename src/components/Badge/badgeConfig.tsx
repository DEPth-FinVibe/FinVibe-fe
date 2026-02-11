import React from "react";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";
import FirstProfitBadgeIcon from "@/assets/svgs/FirstProfitBadgeIcon";
import DiligentInvestorBadgeIcon from "@/assets/svgs/DiligentInvestorBadgeIcon";
import DiversificationMasterBadgeIcon from "@/assets/svgs/DiversificationMasterBadgeIcon";
import BestDebaterBadgeIcon from "@/assets/svgs/BestDebaterBadgeIcon";
import PerfectScoreQuizBadgeIcon from "@/assets/svgs/PerfectScoreQuizBadgeIcon";
import ChallengeMarathonerBadgeIcon from "@/assets/svgs/ChallengeMarathonerBadgeIcon";
import TopOnePercentTraderBadgeIcon from "@/assets/svgs/TopOnePercentTraderBadgeIcon";
import LockIcon from "@/assets/svgs/LockIcon";

// 모든 배지 타입 정의 (백엔드 스펙 순서와 동일)
export type BadgeType =
  | "FIRST_PROFIT"
  | "KNOWLEDGE_SEEKER"
  | "DILIGENT_INVESTOR"
  | "DIVERSIFICATION_MASTER"
  | "BEST_DEBATER"
  | "PERFECT_SCORE_QUIZ"
  | "CHALLENGE_MARATHONER"
  | "TOP_ONE_PERCENT_TRAINER";

export interface BadgeDisplayConfig {
  displayName: string;
  icon: (isAcquired: boolean) => React.ReactNode;
  bg: string;
}

// 배지 타입별 설정
export const BADGE_CONFIG: Record<BadgeType, BadgeDisplayConfig> = {
  FIRST_PROFIT: {
    displayName: "첫 수익",
    icon: (isAcquired) =>
      isAcquired ? (
        <FirstProfitBadgeIcon className="w-[70px] h-[70px]" color="#FE9A00" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-etc-light-yellow",
  },
  KNOWLEDGE_SEEKER: {
    displayName: "지식 탐구자",
    icon: (isAcquired) =>
      isAcquired ? (
        <BadgeAwardsIcon className="w-[70px] h-[70px]" color="#001AFF" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-etc-light-yellow",
  },
  DILIGENT_INVESTOR: {
    displayName: "성실한 투자자",
    icon: (isAcquired) =>
      isAcquired ? (
        <DiligentInvestorBadgeIcon className="w-[70px] h-[70px]" color="#00A63E" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-etc-light-green",
  },
  DIVERSIFICATION_MASTER: {
    displayName: "분산 투자의 정석",
    icon: (isAcquired) =>
      isAcquired ? (
        <DiversificationMasterBadgeIcon className="w-[70px] h-[70px]" color="#9747FF" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-etc-light-purple",
  },
  BEST_DEBATER: {
    displayName: "베스트 토론왕",
    icon: (isAcquired) =>
      isAcquired ? (
        <BestDebaterBadgeIcon className="w-[70px] h-[70px]" color="#FF4FB3" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-etc-light-blue",
  },
  PERFECT_SCORE_QUIZ: {
    displayName: "퀴즈 백점 만점",
    icon: (isAcquired) =>
      isAcquired ? (
        <PerfectScoreQuizBadgeIcon className="w-[70px] h-[70px]" color="#00A6FF" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-gray-100",
  },
  CHALLENGE_MARATHONER: {
    displayName: "챌린지 마라토너",
    icon: (isAcquired) =>
      isAcquired ? (
        <ChallengeMarathonerBadgeIcon className="w-[70px] h-[70px]" color="#D63A3A" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-gray-100",
  },
  TOP_ONE_PERCENT_TRAINER: {
    displayName: "상위 1% 트레이더",
    icon: (isAcquired) =>
      isAcquired ? (
        <TopOnePercentTraderBadgeIcon className="w-[70px] h-[70px]" color="#5A3A22" />
      ) : (
        <LockIcon className="w-[26px] h-[26px]" color="#909193" />
      ),
    bg: "bg-etc-light-blue",
  },
};

// 모든 배지 타입 목록 (순서 고정 - 백엔드 Enum 순서와 동일)
export const ALL_BADGE_TYPES: BadgeType[] = [
  "FIRST_PROFIT",
  "KNOWLEDGE_SEEKER",
  "DILIGENT_INVESTOR",
  "DIVERSIFICATION_MASTER",
  "BEST_DEBATER",
  "PERFECT_SCORE_QUIZ",
  "CHALLENGE_MARATHONER",
  "TOP_ONE_PERCENT_TRAINER",
];


