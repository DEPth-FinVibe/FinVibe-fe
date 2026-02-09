import { studyApiClient } from "./client";

// ─── 타입 정의 ───

export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseCreateRequest = {
  title: string;
  keywords: string[];
  difficulty: CourseDifficulty;
};

export type CourseContentPreviewResponse = {
  content: string;
};

export type LessonSummary = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export type MyCourseResponse = {
  id: number;
  title: string;
  description: string;
  difficulty: CourseDifficulty;
  totalLessonCount: number;
  lessons: LessonSummary[];
};

export type LessonDetailResponse = {
  id: number;
  title: string;
  description: string;
  content: string;
  completed: boolean;
};

export type LessonCompletionItem = {
  lessonId: number;
  completedAt: string;
};

export type MonthlyLessonCompletionResponse = {
  month: string;
  items: LessonCompletionItem[];
};

export type MyStudyMetricResponse = {
  xpEarned: number;
  timeSpentMinutes: number;
  lastPingAt: string;
};

export type TodayAiStudyRecommendResponse = {
  content: string;
};

// 백엔드가 배열을 래핑해서 반환할 수 있으므로 안전하게 추출
function unwrapArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "content", "items", "result"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

// ─── API 메서드 ───

export const studyApi = {
  // ── 학습 코스 ──

  /** 내 코스 목록 조회: GET /study/courses/me */
  getMyCourses: async (): Promise<MyCourseResponse[]> => {
    const res = await studyApiClient.get("/study/courses/me");
    return unwrapArray<MyCourseResponse>(res.data);
  },

  /** 코스 생성: POST /study/courses */
  createCourse: async (req: CourseCreateRequest): Promise<void> => {
    await studyApiClient.post("/study/courses", req);
  },

  /** 코스 미리보기: POST /study/courses/preview */
  previewCourseContent: async (req: CourseCreateRequest): Promise<CourseContentPreviewResponse> => {
    const res = await studyApiClient.post<CourseContentPreviewResponse>("/study/courses/preview", req);
    return res.data;
  },

  /** 키워드 추천: GET /study/keywords/recommended */
  getRecommendedKeywords: async (): Promise<string[]> => {
    const res = await studyApiClient.get("/study/keywords/recommended");
    return unwrapArray<string>(res.data);
  },

  /** 오늘의 AI 학습 추천 조회: GET /study/ai-recommends/today */
  getTodayAiStudyRecommend: async (): Promise<TodayAiStudyRecommendResponse> => {
    const res = await studyApiClient.get<TodayAiStudyRecommendResponse>("/study/ai-recommends/today");
    return res.data;
  },

  // ── 학습 레슨 ──

  /** 레슨 상세 조회: GET /study/lessons/{lessonId} */
  getLessonDetail: async (lessonId: number): Promise<LessonDetailResponse> => {
    const res = await studyApiClient.get<LessonDetailResponse>(`/study/lessons/${lessonId}`);
    return res.data;
  },

  /** 레슨 완료 처리: POST /study/lessons/{lessonId}/complete */
  completeLesson: async (lessonId: number): Promise<void> => {
    await studyApiClient.post(`/study/lessons/${lessonId}/complete`);
  },

  /** 월별 레슨 수료 이력 조회: GET /study/lessons/completions/me */
  getMonthlyLessonCompletions: async (month: string): Promise<MonthlyLessonCompletionResponse> => {
    const res = await studyApiClient.get<MonthlyLessonCompletionResponse>("/study/lessons/completions/me", {
      params: { month },
    });
    return res.data;
  },

  // ── 학습 지표 ──

  /** 1분 학습 핑: POST /study/lessons/{lessonId}/metrics/one-minute */
  oneMinutePing: async (lessonId: number): Promise<void> => {
    await studyApiClient.post(`/study/lessons/${lessonId}/metrics/one-minute`);
  },

  /** 내 학습 지표 조회: GET /study/metrics/me */
  getMyStudyMetric: async (): Promise<MyStudyMetricResponse> => {
    const res = await studyApiClient.get<MyStudyMetricResponse>("/study/metrics/me");
    return res.data;
  },
};
