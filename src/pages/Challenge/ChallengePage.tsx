import { useState, useEffect, useMemo } from "react";
import {
  ChallengeStatus,
  type ChallengeDifficulty,
  Leaderboard,
  MyStats,
  WeeklyEvent,
  LoginPrompt,
} from "@/components";
import {
  gamificationApi,
  type MyXpInfo,
  type MyChallengeItem,
  type UserRankingItem,
} from "@/api/gamification";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const MOCK_WEEKLY_EVENTS = [
  {
    title: "주말 투자 토너먼트",
    description: "주말 동안 가장 높은 수익률을 달성한 상위 10명에게 특별 보상",
    dateLabel: "매주 월요일",
    reward: "1등 : 1000 XP + 전설 배지",
  },
  {
    title: "챌린지 이벤트",
    description: "일주일동안 챌린지를 3개 이상 수행했을 시 보상 지급",
    dateLabel: "매주 월요일",
    reward: "참가자 전원 50 XP",
  },
];

const getDifficultyByRewardXp = (rewardXp: number) => {
  if (rewardXp >= 300) return "어려움" as ChallengeDifficulty;
  if (rewardXp >= 150) return "보통" as ChallengeDifficulty;
  return "쉬움" as ChallengeDifficulty;
};

const clampProgress = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getDaysUntilEnd = (endDate: string) => {
  const matched = endDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matched) return 0;

  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return 0;

  // endDate 당일 23:59:59까지 유효하도록 로컬 타임 기준 계산
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  if (Number.isNaN(end.getTime())) return 0;

  const diffMs = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const formatCurrentYearMonth = () => {
  const today = new Date();
  return {
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1),
  };
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs = 8000): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("request timeout"));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

// ─── 로딩 스켈레톤 ───

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
    <div className="animate-pulse flex flex-col gap-4">
      <div className="h-5 bg-gray-200 rounded w-1/3" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="space-y-3 mt-4">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const ChallengePage = () => {
  const { isLoggedIn } = useRequireAuth();
  const [_myXp, setMyXp] = useState<MyXpInfo | null>(null);

  // 개인 탭 상태
  const [personalChallenges, setPersonalChallenges] = useState<MyChallengeItem[]>([]);
  const [userRanking, setUserRanking] = useState<UserRankingItem[]>([]);
  const [completedChallengeCount, setCompletedChallengeCount] = useState<number>(0);
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [personalTotalXp, setPersonalTotalXp] = useState<number>(0);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalLoaded, setPersonalLoaded] = useState(false);

  // 개인 탭 활성화 시 API 호출
  useEffect(() => {
    // 비로그인 상태에서는 개인화 데이터를 호출하지 않음 (401 방지)
    if (!isLoggedIn) return;
    if (personalLoaded) return;

    let cancelled = false;

    const fetchPersonalData = async () => {
      setPersonalLoading(true);

      const { year, month } = formatCurrentYearMonth();

      try {
        const [challengesResult, rankingResult, completedResult, badgesResult, myXpResult] = await Promise.allSettled([
          withTimeout(gamificationApi.getMyChallenges()),
          withTimeout(gamificationApi.getUserXpRanking("MONTHLY", 8)),
          withTimeout(gamificationApi.getCompletedChallenges(year, month)),
          withTimeout(gamificationApi.getMyBadges()),
          withTimeout(gamificationApi.getMyXp()),
        ]);

        if (cancelled) return;

        if (challengesResult.status === "fulfilled") setPersonalChallenges(challengesResult.value);
        if (rankingResult.status === "fulfilled") setUserRanking(rankingResult.value);
        if (completedResult.status === "fulfilled") setCompletedChallengeCount(completedResult.value.length);
        if (badgesResult.status === "fulfilled") setBadgeCount(badgesResult.value.length);
        if (myXpResult.status === "fulfilled") {
          setPersonalTotalXp(myXpResult.value.totalXp);
          setMyXp(myXpResult.value);
        }
      } finally {
        if (!cancelled) {
          setPersonalLoading(false);
          setPersonalLoaded(true);
        }
      }
    };

    fetchPersonalData();

    return () => {
      cancelled = true;
    };
  }, [personalLoaded, isLoggedIn]);

  // ─── 파생 데이터 ───

  const personalChallengeCards = useMemo(() => {
    return personalChallenges.map((challenge) => {
      const totalValue = challenge.targetValue > 0 ? challenge.targetValue : 100;
      const currentValue = clampProgress(challenge.currentValue, 0, totalValue);
      const daysUntilEnd = getDaysUntilEnd(challenge.endDate);

      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: getDifficultyByRewardXp(challenge.rewardXp),
        progressPercentage: clampProgress(challenge.progressPercentage, 0, 100),
        completedDays: Number(currentValue.toFixed(1)),
        totalDays: Number(totalValue.toFixed(1)),
        daysUntilEnd,
        rewardXp: challenge.rewardXp,
        isPinned: challenge.achieved,
      };
    });
  }, [personalChallenges]);

  const leaderboardItems = useMemo(() => {
    return [...userRanking]
      .sort((a, b) => a.ranking - b.ranking)
      .map((item) => ({
        rank: item.ranking,
        name: item.nickname,
        xp: item.currentXp,
        isMe: _myXp?.userId === item.userId,
        trend: item.growthRate > 0 ? "up" as const : item.growthRate < 0 ? "down" as const : "stable" as const,
      }));
  }, [_myXp?.userId, userRanking]);

  const personalStats = useMemo(() => {
    return {
      completedChallenges: completedChallengeCount,
      badges: badgeCount,
      totalXp: personalTotalXp,
    };
  }, [badgeCount, completedChallengeCount, personalTotalXp]);


  const renderPersonalTab = () => {
    if (personalLoading && !personalLoaded) {
      return (
        <>
          <section className="flex-1 flex flex-col gap-6">
            <SkeletonBlock />
            <SkeletonBlock />
          </section>
          <aside className="w-[360px] shrink-0 flex flex-col gap-8">
            <SkeletonBlock className="h-[360px]" />
          </aside>
        </>
      );
    }

    return (
      <>
      {/* 왼쪽: 진행 중인 챌린지 목록 */}
      <section className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-3 py-4 ">
            <div className="size-8 rounded-full border-2 border-main-1 flex items-center justify-center">
              <div className="size-2 rounded-full bg-main-1" />
            </div>
            <div>
              <h2 className="text-Subtitle_L_Medium text-black font-bold">진행 중인 챌린지</h2>
              <p className="text-Caption_L_Light text-gray-400">목표를 달성하고 보상을 받으세요</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {personalChallengeCards.length > 0 ? (
              personalChallengeCards.map((challenge) => (
                <ChallengeStatus
                  key={challenge.id}
                  title={challenge.title}
                  description={challenge.description}
                  difficulty={challenge.difficulty}
                  progressPercentage={challenge.progressPercentage}
                  completedDays={challenge.completedDays}
                  totalDays={challenge.totalDays}
                  daysUntilEnd={challenge.daysUntilEnd}
                  rewardXp={challenge.rewardXp}
                  isPinned={challenge.isPinned}
                  className="bg-white shadow-sm border border-gray-200"
                />
              ))
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">진행 중인 챌린지가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 주간 이벤트 */}
        <section className="flex flex-col gap-6 bg-white rounded-lg p-6 ">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-main-1">⚡</span>
            <h2 className="text-Subtitle_L_Medium text-black font-bold">주간 이벤트</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {MOCK_WEEKLY_EVENTS.map((event, index) => (
              <WeeklyEvent
                key={index}
                title={event.title}
                description={event.description}
                dateLabel={event.dateLabel}
                reward={event.reward}
                className="bg-[#FFF9E5] border-none shadow-sm"
              />
            ))}
          </div>
        </section>
      </section>

      {/* 오른쪽: 리더보드 및 통계 */}
      <aside className="w-[360px] shrink-0 flex flex-col gap-8">
        <Leaderboard items={leaderboardItems} />
        <MyStats
          completedChallenges={personalStats.completedChallenges}
          badges={personalStats.badges}
          totalXp={personalStats.totalXp}
        />
      </aside>
    </>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="flex flex-col px-32 py-10 gap-10">


        {!isLoggedIn && (
          <LoginPrompt message="로그인하면 나의 챌린지 진행 상황과 랭킹을 확인할 수 있어요" />
        )}

        <div className="flex gap-10">
          {renderPersonalTab()}
        </div>
      </main>
    </div>
  );
};

export default ChallengePage;
