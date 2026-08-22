import { gamificationApiClient } from "./client";

// ─── 타입 정의 ───

export type MyXpInfo = {
  userId: string;
  nickname?: string;
  totalXp: number;
  level: number;
};

export type ChallengeMetricType =
  | "LOGIN_COUNT_PER_DAY"
  | "CURRENT_RETURN_RATE"
  | "STOCK_BUY_COUNT"
  | "STOCK_SELL_COUNT"
  | "PORTFOLIO_COUNT_WITH_STOCKS"
  | "HOLDING_STOCK_COUNT"
  | "NEWS_COMMENT_COUNT"
  | "NEWS_LIKE_COUNT"
  | "DISCUSSION_POST_COUNT"
  | "DISCUSSION_COMMENT_COUNT"
  | "DISCUSSION_LIKE_COUNT"
  | "AI_CONTENT_COMPLETE_COUNT"
  | "CHALLENGE_COMPLETION_COUNT"
  | "LOGIN_STREAK_DAYS"
  | "LAST_LOGIN_DATETIME";

export type MyChallengeItem = {
  id: number;
  title: string;
  description: string;
  metricType: ChallengeMetricType;
  targetValue: number;
  currentValue: number;
  progressPercentage: number;
  rewardXp: number;
  startDate: string;
  endDate: string;
  achieved: boolean;
};

export type ChallengeHistoryItem = {
  challengeId: number;
  title: string;
  description: string;
  metricType: ChallengeMetricType;
  targetValue: number;
  rewardXp: number;
  startDate: string;
  endDate: string;
  completedAt: string;
};

export type UserRankingItem = {
  userId: string;
  nickname: string;
  ranking: number;
  currentXp: number;
  periodXp: number;
  previousPeriodXp: number;
  growthRate: number;
};

export type RankingPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export type BadgeInfo = {
  badge: string;
  displayName: string;
  acquiredAt: string;
};

// 백엔드가 배열을 래핑해서 반환할 수 있으므로 안전하게 추출
function unwrapArray<T>(data: unknown, depth = 0): T[] {
  if (Array.isArray(data)) return data;
  if (depth > 3) return [];

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    for (const key of ["data", "content", "items", "result", "list"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }

    for (const value of Object.values(obj)) {
      const nested = unwrapArray<T>(value, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

// ─── API 메서드 ───

export const gamificationApi = {
  /** 내 XP 정보 조회: GET /xp/me */
  getMyXp: async (): Promise<MyXpInfo> => {
    const res = await gamificationApiClient.get<MyXpInfo>("/xp/me");
    return res.data;
  },

  /** 전체 사용자 XP 랭킹 조회: GET /xp/users/ranking */
  getUserXpRanking: async (period?: RankingPeriod, size?: number): Promise<UserRankingItem[]> => {
    const res = await gamificationApiClient.get("/xp/users/ranking", {
      params: {
        ...(period ? { period } : {}),
        ...(size != null ? { size } : {}),
      },
    });
    return unwrapArray<UserRankingItem>(res.data);
  },

  /** 내 챌린지 목록 조회: GET /challenges/me */
  getMyChallenges: async (): Promise<MyChallengeItem[]> => {
    const res = await gamificationApiClient.get("/challenges/me");
    return unwrapArray<MyChallengeItem>(res.data);
  },

  /** 월별 챌린지 완료 내역 조회: GET /challenges/completed */
  getCompletedChallenges: async (year: string, month: string): Promise<ChallengeHistoryItem[]> => {
    const res = await gamificationApiClient.get("/challenges/completed", {
      params: { year, month },
    });
    return unwrapArray<ChallengeHistoryItem>(res.data);
  },

  /** 내 배지 목록 조회: GET /badges/me */
  getMyBadges: async (): Promise<BadgeInfo[]> => {
    const res = await gamificationApiClient.get("/badges/me");
    return unwrapArray<BadgeInfo>(res.data);
  },
};
