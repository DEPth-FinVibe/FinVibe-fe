import { useState, useEffect, useMemo, type ReactNode } from "react";
import type { AxiosError } from "axios";
import {
  ChallengeStatus,
  type ChallengeDifficulty,
  Leaderboard,
  MyStats,
  WeeklyEvent,
  SwitchBar,
  SquadWeeklyBattle,
  SquadRanking,
  SquadMVP,
  SquadInfoPanel,
  LoginPrompt,
} from "@/components";
import { SquadRankingModal } from "@/components/SquadRankingModal";
import {
  gamificationApi,
  type SquadRankingItem,
  type SquadContributionItem,
  type MyXpInfo,
  type MySquadInfo,
  type MyChallengeItem,
  type UserRankingItem,
  type SquadItem,
} from "@/api/gamification";
import { useRequireAuth } from "@/hooks/useRequireAuth";

type ChallengeTab = "personal" | "squad";

type ChallengeTabOption = {
  id: ChallengeTab;
  label: string;
  icon: (color: string) => ReactNode;
};

const CHALLENGE_TABS: [ChallengeTabOption, ChallengeTabOption] = [
  {
    id: "personal",
    label: "개인 챌린지",
    icon: (color: string) => <span style={{ color }}>👤</span>,
  },
  {
    id: "squad",
    label: "스쿼드 챌린지",
    icon: (color: string) => <span style={{ color }}>👨‍👩‍👧‍👦</span>,
  },
];

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

const isNotFoundError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const maybeAxiosError = error as AxiosError;
  return maybeAxiosError.response?.status === 404;
};

// ─── 스쿼드 탭 스켈레톤 ───

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

const SquadFallbackCard = ({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center">
    <p className="text-Body_M_Medium text-black mb-2">{title}</p>
    <p className="text-sm text-gray-400 mb-4">{description}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

const ChallengePage = () => {
  const [activeTab, setActiveTab] = useState<ChallengeTab>("personal");

  // 스쿼드 탭 상태
  const [squadRanking, setSquadRanking] = useState<SquadRankingItem[]>([]);
  const [squadList, setSquadList] = useState<SquadItem[]>([]);
  const { isLoggedIn, requireAuth } = useRequireAuth();
  const [squadSearchKeyword, setSquadSearchKeyword] = useState("");
  const [squadContributions, setSquadContributions] = useState<SquadContributionItem[]>([]);
  const [_myXp, setMyXp] = useState<MyXpInfo | null>(null);
  const [mySquadInfo, setMySquadInfo] = useState<MySquadInfo | null>(null);
  const [hasMySquad, setHasMySquad] = useState<boolean | null>(null);
  const [squadTabError, setSquadTabError] = useState<string | null>(null);
  const [squadRankingError, setSquadRankingError] = useState<string | null>(null);
  const [squadContributionError, setSquadContributionError] = useState<string | null>(null);
  const [joiningSquadId, setJoiningSquadId] = useState<number | null>(null);
  const [squadJoinError, setSquadJoinError] = useState<string | null>(null);
  const [squadLoading, setSquadLoading] = useState(false);
  const [squadLoaded, setSquadLoaded] = useState(false);

  // 개인 탭 상태
  const [personalChallenges, setPersonalChallenges] = useState<MyChallengeItem[]>([]);
  const [userRanking, setUserRanking] = useState<UserRankingItem[]>([]);
  const [completedChallengeCount, setCompletedChallengeCount] = useState<number>(0);
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [personalTotalXp, setPersonalTotalXp] = useState<number>(0);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalLoaded, setPersonalLoaded] = useState(false);

  // 모달 상태
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);

  const refetchSquadData = () => {
    setSquadLoaded(false);
    setSquadLoading(false);
    setSquadTabError(null);
    setSquadRankingError(null);
    setSquadContributionError(null);
  };

  // 스쿼드 탭 활성화 시 API 호출
  useEffect(() => {
    if (activeTab !== "squad") return;
    // 비로그인 상태에서는 개인화 데이터를 호출하지 않음 (401 방지)
    if (!isLoggedIn) return;
    if (squadLoaded) return;

    let cancelled = false;

    const fetchSquadData = async () => {
      setSquadLoading(true);
      setSquadTabError(null);
      setSquadRankingError(null);
      setSquadContributionError(null);

      const [mySquadResult, rankingResult, squadListResult, contributionsResult, xpResult] = await Promise.allSettled([
        gamificationApi.getMySquad(),
        gamificationApi.getSquadRanking(),
        gamificationApi.getSquads(),
        gamificationApi.getMySquadContributions(),
        gamificationApi.getMyXp(),
      ]);

      if (cancelled) return;

      if (mySquadResult.status === "fulfilled") {
        setMySquadInfo(mySquadResult.value);
        setHasMySquad(true);
      } else {
        if (isNotFoundError(mySquadResult.reason)) {
          setMySquadInfo(null);
          setHasMySquad(false);
        } else {
          setHasMySquad(false);
          setSquadTabError("스쿼드 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      }

      if (rankingResult.status === "fulfilled") {
        setSquadRanking(rankingResult.value);
      } else {
        setSquadRanking([]);
        setSquadRankingError("스쿼드 랭킹을 불러오지 못했어요.");
      }
      if (squadListResult.status === "fulfilled") {
        if (squadListResult.value.length > 0) {
          setSquadList(squadListResult.value);
        } else if (rankingResult.status === "fulfilled") {
          setSquadList(
            rankingResult.value.map((item) => ({
              squadId: item.squadId,
              squadName: item.squadName,
              currentRanking: item.currentRanking,
              totalXp: item.totalXp,
            }))
          );
        }
      }
      if (contributionsResult.status === "fulfilled") {
        setSquadContributions(contributionsResult.value);
      } else {
        setSquadContributions([]);
        setSquadContributionError("스쿼드 기여도 정보를 불러오지 못했어요.");
      }
      if (xpResult.status === "fulfilled") setMyXp(xpResult.value);

      setSquadLoading(false);
      setSquadLoaded(true);
    };

    fetchSquadData();

    return () => {
      cancelled = true;
    };
  }, [activeTab, squadLoaded, isLoggedIn]);

  const handleJoinSquad = async (squadId: number) => {
    // 비로그인 상태면 로그인 페이지로 유도
    if (!requireAuth(undefined, "스쿼드에 가입하려면 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?")) return;
    setJoiningSquadId(squadId);
    setSquadJoinError(null);

    try {
      await gamificationApi.joinSquad(squadId);
      setHasMySquad(true);
      setSquadLoaded(false);
    } catch {
      setSquadJoinError("스쿼드 가입에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setJoiningSquadId(null);
    }
  };

  // 개인 탭 활성화 시 API 호출
  useEffect(() => {
    if (activeTab !== "personal") return;
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
  }, [activeTab, personalLoaded, isLoggedIn]);

  // ─── 파생 데이터 ───

  // 내 스쿼드: contributions API 결과가 있으면 해당 스쿼드에서 매칭
  // 임시로 랭킹 1위 학교를 내 학교로 설정 (백엔드에 squadId 필드 추가 시 교체)
  const mySquadData = squadRanking?.[0] ?? null;
  const mySquadId = mySquadData?.squadId ?? null;

  // 라이벌: 내 학교 바로 위 순위
  const rivalSquad = (() => {
    if (!Array.isArray(squadRanking) || !mySquadData) return null;
    const sorted = [...squadRanking].sort((a, b) => a.currentRanking - b.currentRanking);
    const myIndex = sorted.findIndex((s) => s.squadId === mySquadId);
    if (myIndex <= 0) return null; // 1위이거나 찾지 못함
    return sorted[myIndex - 1];
  })();

  // 내 기여도 상위 %
  const myContributionPercentile = (() => {
    if (!Array.isArray(squadContributions) || squadContributions.length === 0) return 50;
    const totalMembers = squadContributions.length;
    const myRanking = squadContributions.find((c) => c.ranking === 1)?.ranking ?? Math.ceil(totalMembers / 2);
    return (myRanking / totalMembers) * 100;
  })();

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

  // ─── 개인 챌린지 렌더링 ───

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

  // ─── 스쿼드 챌린지 렌더링 ───

  const renderSquadTab = () => {
    // 로딩 상태
    if (squadLoading || hasMySquad === null) {
      return (
        <>
          <section className="flex-1 flex flex-col gap-6">
            <SkeletonBlock />
            <SkeletonBlock />
            <SkeletonBlock />
          </section>
          <aside className="w-[360px] shrink-0">
            <SkeletonBlock className="h-[400px]" />
          </aside>
        </>
      );
    }

    if (squadTabError) {
      return (
        <section className="w-full">
          <SquadFallbackCard
            title="스쿼드 챌린지 정보를 가져오지 못했어요"
            description={squadTabError}
            actionLabel="다시 시도"
            onAction={refetchSquadData}
          />
        </section>
      );
    }

    if (!hasMySquad) {
      const normalizedKeyword = squadSearchKeyword.trim().toLowerCase();
      const joinableSquads = squadList
        .map((item) => ({
          ...item,
          numericSquadId: Number(item.squadId),
        }))
        .filter((item) => {
          if (!normalizedKeyword) return true;
          const name = item.squadName.toLowerCase();
          const region = (item.region ?? "").toLowerCase();
          return name.includes(normalizedKeyword) || region.includes(normalizedKeyword);
        });

      return (
        <section className="w-full flex flex-col gap-5">
          <div className="rounded-2xl border border-[#D7EFEA] bg-gradient-to-r from-[#EFFFFB] via-[#F4FCFA] to-white p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex flex-col gap-2">
                <h2 className="text-[30px] leading-[38px] font-bold text-[#12212A]">스쿼드에 가입해 보세요</h2>
                <p className="text-sm text-[#4D6A77]">
                  같은 학교 유저들과 함께 챌린지를 달리고, 주간 XP 랭킹 보상을 노려보세요.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full bg-white px-4 py-2 border border-[#C9EDE5]">
                <span className="text-sm font-semibold text-[#1D8D79]">총 {joinableSquads.length}개 스쿼드</span>
              </div>
            </div>
          </div>

          {squadJoinError && (
            <p className="text-sm text-etc-red">{squadJoinError}</p>
          )}

          <div className="rounded-xl border border-[#E4ECEF] bg-white px-4 py-3">
            <input
              type="text"
              value={squadSearchKeyword}
              onChange={(e) => setSquadSearchKeyword(e.target.value)}
              placeholder="학교명 또는 지역으로 검색"
              className="w-full bg-transparent text-sm text-[#14222B] placeholder:text-[#9AAEB8] outline-none"
              aria-label="스쿼드 검색"
            />
          </div>

          {joinableSquads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinableSquads.map((item) => (
                <div
                  key={item.squadId}
                  className="group flex items-center justify-between rounded-xl border border-[#E4ECEF] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:border-[#8EDBCB] hover:shadow-[0_6px_18px_rgba(33,154,132,0.12)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-11 rounded-xl bg-[#ECF9F6] text-[#1D8D79] flex items-center justify-center text-lg shrink-0">
                      🎓
                    </div>
                    <div className="min-w-0 flex flex-col gap-1">
                      <span className="text-[16px] font-semibold text-[#14222B] truncate">{item.squadName}</span>
                      <div className="flex items-center gap-2 text-xs">
                        {item.region && (
                          <span className="inline-flex items-center rounded-full bg-[#F3FAF8] border border-[#D8EFEA] px-2 py-0.5 text-[#1D8D79]">
                            {item.region}
                          </span>
                        )}
                        {typeof item.currentRanking === "number" ? (
                          <span className="text-[#5C7682]">현재 #{item.currentRanking}위</span>
                        ) : (
                          <span className="text-[#8AA0AA]">{item.squadName} 스쿼드</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-main-1 px-4 py-2 text-white text-sm font-semibold disabled:opacity-60 shrink-0"
                    onClick={() => {
                      if (Number.isFinite(item.numericSquadId)) {
                        handleJoinSquad(item.numericSquadId);
                      }
                    }}
                    disabled={
                      !Number.isFinite(item.numericSquadId) || joiningSquadId === item.numericSquadId
                    }
                  >
                    {joiningSquadId === item.numericSquadId ? "가입 중..." : "가입하기"}
                  </button>
                </div>
              ))}
            </div>
          ) : squadSearchKeyword.trim() ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center text-sm text-gray-400">
              검색 결과가 없습니다. 다른 학교명이나 지역으로 검색해 보세요.
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center text-sm text-gray-400">
              가입 가능한 스쿼드 목록이 없습니다.
            </div>
          )}
        </section>
      );
    }

    // 데이터 로드 완료 — 성공한 것만 렌더링
    return (
      <>
        {/* 왼쪽: 스쿼드 컨텐츠 */}
        <section className="flex-1 flex flex-col gap-6">
          {mySquadData ? (
            <SquadWeeklyBattle mySquad={mySquadData} rivalSquad={rivalSquad} />
          ) : (
            <SquadFallbackCard
              title="주간 배틀 데이터를 준비 중이에요"
              description="내 스쿼드 랭킹 정보가 없어서 배틀 현황을 표시할 수 없습니다."
              actionLabel="새로고침"
              onAction={refetchSquadData}
            />
          )}
          {squadRanking.length > 0 ? (
            <SquadRanking
              items={squadRanking}
              mySquadId={mySquadId}
              onViewAll={() => setShowRankingModal(true)}
            />
          ) : (
            <SquadFallbackCard
              title={squadRankingError ? "스쿼드 랭킹을 불러오지 못했어요" : "아직 스쿼드 랭킹 데이터가 없어요"}
              description={
                squadRankingError
                  ? "네트워크 상태를 확인하고 다시 시도해 주세요."
                  : "주간 랭킹 집계가 시작되면 여기에 순위가 표시됩니다."
              }
              actionLabel="다시 시도"
              onAction={refetchSquadData}
            />
          )}
          {squadContributions.length > 0 ? (
            <SquadMVP
              items={squadContributions}
              onViewAll={() => setShowContributionModal(true)}
            />
          ) : (
            <SquadFallbackCard
              title={squadContributionError ? "기여도 데이터를 불러오지 못했어요" : "이번 주 기여도 집계 전이에요"}
              description={
                squadContributionError
                  ? "잠시 후 다시 시도해 주세요."
                  : "스쿼드 활동이 누적되면 MVP 랭킹이 표시됩니다."
              }
              actionLabel="다시 시도"
              onAction={refetchSquadData}
            />
          )}
        </section>

        {/* 오른쪽: 학교 정보 패널 */}
        <aside className="w-[360px] shrink-0">
          {mySquadData ? (
            <SquadInfoPanel
              squadName={mySquadData.squadName}
              currentRanking={mySquadData.currentRanking}
              weeklyXpChangeRate={mySquadData.weeklyXpChangeRate}
              myContributionPercentile={myContributionPercentile}
            />
          ) : (
            <SquadFallbackCard
              title="내 스쿼드 요약이 비어 있어요"
              description="스쿼드 정보가 집계되면 우측 패널에 상세 현황이 표시됩니다."
              actionLabel="다시 시도"
              onAction={refetchSquadData}
            />
          )}
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
          {/* 탭 스위치 + 콘텐츠를 감싸는 래퍼 */}
          <section className="flex-1 flex flex-col gap-6">
            {/* 상단 탭 스위치 */}
            <div className="flex justify-center">
              <SwitchBar
                activeTab={activeTab}
                onChange={setActiveTab}
                tabs={CHALLENGE_TABS}
                className=""
              />
            </div>
          </section>
        </div>

        <div className="flex gap-10">
          {activeTab === "personal" ? renderPersonalTab() : renderSquadTab()}
        </div>
      </main>

      {/* 대학 랭킹 모달 */}
      <SquadRankingModal
        isOpen={showRankingModal}
        onClose={() => setShowRankingModal(false)}
        variant="university"
        squadRankingItems={squadRanking}
        mySquadId={mySquadId}
      />

      {/* 기여도 랭킹 모달 */}
      <SquadRankingModal
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        variant="contribution"
        contributionItems={squadContributions}
        myNickname={mySquadInfo?.nickname}
      />
    </div>
  );
};

export default ChallengePage;
