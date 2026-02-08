import { gamificationApiClient } from "./client";

// ─── 타입 정의 ───

export type SquadRankingItem = {
  squadId: number;
  squadName: string;
  currentRanking: number;
  totalXp: number;
  weeklyXp: number;
  weeklyXpChangeRate: number;
  rankingChange: number;
};

export type SquadContributionItem = {
  nickname: string;
  ranking: number;
  weeklyContributionXp: number;
};

export type MyXpInfo = {
  userId: string;
  totalXp: number;
  level: number;
};

export type SquadItem = {
  userId: string;
  nickname: string;
  totalXp: number;
  level: number;
};

export type MySquadInfo = {
  userId: string;
  nickname: string;
  totalXp: number;
  level: number;
};

// 백엔드가 배열을 래핑해서 반환할 수 있으므로 안전하게 추출
function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    // { data: [...] }, { content: [...] } 등 일반적인 래핑 패턴 처리
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "content", "items", "result"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

// ─── API 메서드 ───

export const gamificationApi = {
  /** 스쿼드(대학) 랭킹 조회: GET /xp/squads/ranking */
  getSquadRanking: async (): Promise<SquadRankingItem[]> => {
    const res = await gamificationApiClient.get("/xp/squads/ranking");
    return unwrapArray<SquadRankingItem>(res.data);
  },

  /** 내 스쿼드 기여도 조회: GET /xp/squads/contributions/me */
  getMySquadContributions: async (): Promise<SquadContributionItem[]> => {
    const res = await gamificationApiClient.get("/xp/squads/contributions/me");
    return unwrapArray<SquadContributionItem>(res.data);
  },

  /** 내 XP 정보 조회: GET /xp/me */
  getMyXp: async (): Promise<MyXpInfo> => {
    const res = await gamificationApiClient.get<MyXpInfo>("/xp/me");
    return res.data;
  },

  /** 전체 스쿼드 목록 조회: GET /squads */
  getSquads: async (): Promise<SquadItem[]> => {
    const res = await gamificationApiClient.get("/squads");
    return unwrapArray<SquadItem>(res.data);
  },

  /** 내 스쿼드 조회: GET /squads/me */
  getMySquad: async (): Promise<MySquadInfo> => {
    const res = await gamificationApiClient.get<MySquadInfo>("/squads/me");
    return res.data;
  },

  /** 스쿼드 참여: POST /squads/{squadId}/join */
  joinSquad: async (squadId: number): Promise<void> => {
    await gamificationApiClient.post(`/squads/${squadId}/join`);
  },
};
