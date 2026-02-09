import { insightApiClient } from "./client";

// ─── 타입 정의 ───

export type EconomicSignal = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export type NewsKeyword =
  | "SEMICONDUCTOR" | "BATTERY" | "AI" | "EV" | "BIO"
  | "PLATFORM" | "SPACE" | "ENTERTAINMENT"
  | "RATE_FREEZE" | "RATE_HIKE" | "RATE_CUT"
  | "INFLATION" | "EXCHANGE_RATE" | "FOMC" | "RECESSION"
  | "REAL_ESTATE" | "OIL_PRICE"
  | "DIVIDEND_STOCK" | "GROWTH_STOCK" | "VALUE_STOCK"
  | "ETF" | "IPO" | "THEME_STOCK"
  | "EARNINGS_RELEASE" | "EARNINGS_SURPRISE" | "EARNINGS_SHOCK"
  | "M_AND_A" | "BONUS_ISSUE" | "RIGHTS_ISSUE"
  | "SHAREHOLDERS_MEETING" | "EX_DIVIDEND_DATE";

export type NewsSortType = "LATEST" | "POPULAR";

/** 뉴스 목록 아이템 */
export type NewsListItem = {
  id: number;
  title: string;
  economicSignal: EconomicSignal;
  keyword: NewsKeyword;
  createdAt: string | null;
  analysis?: string;
  likeCount?: number;
  discussionCount?: number;
};

/** 뉴스 요약 (테마 상세/뉴스 상세 내부) */
export type NewsSummary = {
  title: string;
  publishedAt: string;
  provider: string;
};

/** 뉴스/테마 상세 응답 */
export type NewsDetailResponse = {
  id?: number;
  title?: string;
  content?: string;
  provider?: string;
  createdAt?: string | null;
  publishedAt?: string | null;
  keyword?: NewsKeyword;
  economicSignal?: EconomicSignal;
  likeCount?: number;
  discussionCount?: number;
  isLiked?: boolean;
  likedByMe?: boolean;
  categoryId?: number;
  categoryName?: string;
  analysis?: string;
  news?: NewsSummary[];
};

/** 오늘의 테마 요약 */
export type ThemeSummary = {
  categoryId: number;
  categoryName: string;
  averageChangePct: number;
};

/** 키워드 트렌드 아이템 */
export type KeywordTrendItem = {
  keyword: NewsKeyword;
  count: number;
};

function unwrapArray<T>(data: unknown, depth = 0): T[] {
  if (Array.isArray(data)) return data;
  if (depth > 3) return [];

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    for (const key of ["data", "content", "items", "result", "news", "list"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }

    for (const value of Object.values(obj)) {
      const nested = unwrapArray<T>(value, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

// ─── 키워드 한글 매핑 ───

export const KEYWORD_LABEL_MAP: Record<NewsKeyword, string> = {
  SEMICONDUCTOR: "반도체",
  BATTERY: "배터리",
  AI: "AI",
  EV: "전기차",
  BIO: "바이오",
  PLATFORM: "플랫폼",
  SPACE: "우주",
  ENTERTAINMENT: "엔터테인먼트",
  RATE_FREEZE: "금리동결",
  RATE_HIKE: "금리인상",
  RATE_CUT: "금리인하",
  INFLATION: "인플레이션",
  EXCHANGE_RATE: "환율",
  FOMC: "FOMC",
  RECESSION: "경기침체",
  REAL_ESTATE: "부동산",
  OIL_PRICE: "유가",
  DIVIDEND_STOCK: "배당주",
  GROWTH_STOCK: "성장주",
  VALUE_STOCK: "가치주",
  ETF: "ETF",
  IPO: "IPO",
  THEME_STOCK: "테마주",
  EARNINGS_RELEASE: "실적발표",
  EARNINGS_SURPRISE: "어닝서프라이즈",
  EARNINGS_SHOCK: "어닝쇼크",
  M_AND_A: "M&A",
  BONUS_ISSUE: "무상증자",
  RIGHTS_ISSUE: "유상증자",
  SHAREHOLDERS_MEETING: "주주총회",
  EX_DIVIDEND_DATE: "배당락일",
};

// ─── API 메서드 ───

export const newsApi = {
  /** 뉴스 목록 조회: GET /news */
  getNewsList: async (sort: NewsSortType = "LATEST"): Promise<NewsListItem[]> => {
    const res = await insightApiClient.get("/news", {
      params: { sortType: sort },
    });
    return unwrapArray<NewsListItem>(res.data);
  },

  /** 뉴스 상세 조회: GET /news/{id} */
  getNewsDetail: async (id: number): Promise<NewsDetailResponse> => {
    const res = await insightApiClient.get<NewsDetailResponse | { data?: NewsDetailResponse; result?: NewsDetailResponse }>(`/news/${id}`);
    const data = res.data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const obj = data as { data?: NewsDetailResponse; result?: NewsDetailResponse };
      if (obj.data && typeof obj.data === "object") return obj.data;
      if (obj.result && typeof obj.result === "object") return obj.result;
    }
    return data as NewsDetailResponse;
  },

  /** 뉴스 좋아요 토글: POST /news/{id}/like */
  toggleNewsLike: async (id: number): Promise<void> => {
    await insightApiClient.post(`/news/${id}/like`);
  },

  /** 일간 키워드 트렌드 조회: GET /news/keywords/trending */
  getKeywordTrends: async (): Promise<KeywordTrendItem[]> => {
    const res = await insightApiClient.get("/news/keywords/trending");
    return unwrapArray<KeywordTrendItem>(res.data);
  },

  /** 오늘의 테마 목록 조회: GET /themes/today */
  getTodayThemes: async (): Promise<ThemeSummary[]> => {
    const res = await insightApiClient.get("/themes/today");
    return unwrapArray<ThemeSummary>(res.data);
  },

  /** 오늘의 테마 상세 조회: GET /themes/today/{categoryId} */
  getTodayThemeDetail: async (categoryId: number): Promise<NewsDetailResponse> => {
    const res = await insightApiClient.get<NewsDetailResponse>(`/themes/today/${categoryId}`);
    return res.data;
  },
};
