import { useQuery } from "@tanstack/react-query";
import { tradeApi } from "@/api/trade";
import { studyApi } from "@/api/study";
import { gamificationApi } from "@/api/gamification";

// --- Types ---

export type ActivityType = "trade" | "study" | "challenge";

export type RecentActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
};

// --- Helpers ---

export function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(diff / 86_400_000);
  if (days < 30) return `${days}일 전`;

  return `${Math.floor(days / 30)}개월 전`;
}

// --- Query Keys ---

export const recentActivityKeys = {
  all: ["recentActivity"] as const,
  month: (year: number, month: number) =>
    [...recentActivityKeys.all, year, month] as const,
};

// --- Hook ---

export function useRecentActivity() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  return useQuery({
    queryKey: recentActivityKeys.month(year, month),
    queryFn: async (): Promise<RecentActivityItem[]> => {
      const [tradesResult, lessonsResult, challengesResult, coursesResult] =
        await Promise.allSettled([
          tradeApi.getTradeHistory(year, month),
          studyApi.getMonthlyLessonCompletions(monthStr),
          gamificationApi.getCompletedChallenges(
            String(year),
            String(month).padStart(2, "0"),
          ),
          studyApi.getMyCourses(),
        ]);

      const activities: RecentActivityItem[] = [];

      // 거래 내역 → 최신 1건
      if (tradesResult.status === "fulfilled" && tradesResult.value.length > 0) {
        const sorted = [...tradesResult.value].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const trade = sorted[0];
        const action = trade.transactionType === "BUY" ? "매수" : "매도";
        activities.push({
          id: `trade-${trade.tradeId}`,
          type: "trade",
          title: `${trade.stockName ?? "종목"} ${action}`,
          timestamp: trade.createdAt,
        });
      }

      // 학습(레슨) 완료 → 최신 1건
      if (lessonsResult.status === "fulfilled" && lessonsResult.value.items.length > 0) {
        const lessonTitleMap = new Map<number, string>();
        if (coursesResult.status === "fulfilled") {
          for (const course of coursesResult.value) {
            for (const lesson of course.lessons) {
              lessonTitleMap.set(lesson.id, lesson.title);
            }
          }
        }

        const sorted = [...lessonsResult.value.items].sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
        );
        const item = sorted[0];
        const lessonTitle = lessonTitleMap.get(item.lessonId);
        activities.push({
          id: `study-${item.lessonId}-${item.completedAt}`,
          type: "study",
          title: lessonTitle
            ? `${lessonTitle} 학습 완료`
            : "레슨 학습 완료",
          timestamp: item.completedAt,
        });
      }

      // 챌린지 달성 → 최신 1건
      if (challengesResult.status === "fulfilled" && challengesResult.value.length > 0) {
        const sorted = [...challengesResult.value].sort(
          (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
        );
        const challenge = sorted[0];
        activities.push({
          id: `challenge-${challenge.challengeId}`,
          type: "challenge",
          title: `${challenge.title} 달성`,
          timestamp: challenge.completedAt,
        });
      }

      // 최신순 정렬
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      return activities;
    },
    staleTime: 60_000,
  });
}
