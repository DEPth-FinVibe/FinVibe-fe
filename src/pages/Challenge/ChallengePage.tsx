import { useState, useEffect } from "react";
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
} from "@/components";
import { SquadRankingModal } from "@/components/SquadRankingModal";
import {
  gamificationApi,
  type SquadRankingItem,
  type SquadContributionItem,
  type MyXpInfo,
  type MySquadInfo,
} from "@/api/gamification";

type ChallengeTab = "personal" | "squad";

const CHALLENGE_TABS: [any, any] = [
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

// Mock 데이터들
const MOCK_LEADERBOARD = [
  { rank: 1, name: "투자고수", xp: 15420, trend: "up" as const },
  { rank: 2, name: "주식왕", xp: 14850, trend: "up" as const },
  { rank: 3, name: "경제박사", xp: 14320, trend: "up" as const },
  { rank: 4, name: "재테크맨", xp: 13950, trend: "up" as const },
  { rank: 5, name: "투자천재", xp: 13560 },
  { rank: 6, name: "주린이탈출", xp: 12890, trend: "up" as const },
  { rank: 7, name: "수익왕", xp: 12450, trend: "up" as const },
  { rank: 8, name: "당신", xp: 11230, isMe: true, trend: "up" as const },
];

const MOCK_STATS = {
  completedChallenges: 12,
  badges: 8,
  totalXp: 11230,
};

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

// Mock 개인 챌린지 데이터
const MOCK_PERSONAL_CHALLENGES = [
  {
    id: 1,
    title: "7일 연속 출석",
    description: "7일 연속 로그인",
    difficulty: "쉬움" as ChallengeDifficulty,
    completedDays: 7,
    totalDays: 7,
    participants: 1234,
    daysUntilEnd: 3,
    rewardXp: 100,
    isPinned: true,
  },
  {
    id: 2,
    title: "수익률 5% 도전",
    description: "총자산 수익률 5% 이상 달성하기",
    difficulty: "보통" as ChallengeDifficulty,
    completedDays: 3.2,
    totalDays: 5,
    participants: 856,
    daysUntilEnd: 10,
    rewardXp: 300,
    isPinned: false,
  },
  {
    id: 3,
    title: "가치 투자 마스터",
    description: "특정 종목 보유 기간 14일 이상 유지",
    difficulty: "어려움" as ChallengeDifficulty,
    completedDays: 9,
    totalDays: 14,
    participants: 645,
    daysUntilEnd: 5,
    rewardXp: 200,
    isPinned: false,
  },
  {
    id: 4,
    title: "7일 연속 투자",
    description: "일주일 동안 매일 최소 1회 거래하기",
    difficulty: "쉬움" as ChallengeDifficulty,
    completedDays: 2,
    totalDays: 4,
    participants: 423,
    daysUntilEnd: 15,
    rewardXp: 500,
    isPinned: false,
    isFailed: true,
  },
];

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

const ChallengePage = () => {
  const [activeTab, setActiveTab] = useState<ChallengeTab>("personal");

  // 스쿼드 탭 상태
  const [squadRanking, setSquadRanking] = useState<SquadRankingItem[]>([]);
  const [squadContributions, setSquadContributions] = useState<SquadContributionItem[]>([]);
  const [myXp, setMyXp] = useState<MyXpInfo | null>(null);
  const [mySquadInfo, setMySquadInfo] = useState<MySquadInfo | null>(null);
  const [squadLoading, setSquadLoading] = useState(false);
  const [squadLoaded, setSquadLoaded] = useState(false);

  // 모달 상태
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);

  // 스쿼드 탭 활성화 시 API 호출
  useEffect(() => {
    if (activeTab !== "squad") return;
    if (squadLoaded || squadLoading) return;

    let cancelled = false;

    const fetchSquadData = async () => {
      setSquadLoading(true);

      const [rankingResult, contributionsResult, xpResult, mySquadResult] = await Promise.allSettled([
        gamificationApi.getSquadRanking(),
        gamificationApi.getMySquadContributions(),
        gamificationApi.getMyXp(),
        gamificationApi.getMySquad(),
      ]);

      if (cancelled) return;

      if (rankingResult.status === "fulfilled") setSquadRanking(rankingResult.value);
      if (contributionsResult.status === "fulfilled") setSquadContributions(contributionsResult.value);
      if (xpResult.status === "fulfilled") setMyXp(xpResult.value);
      if (mySquadResult.status === "fulfilled") setMySquadInfo(mySquadResult.value);

      setSquadLoading(false);
      setSquadLoaded(true);
    };

    fetchSquadData();

    return () => {
      cancelled = true;
    };
  }, [activeTab, squadLoaded, squadLoading]);

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

  // ─── 개인 챌린지 렌더링 ───

  const renderPersonalTab = () => (
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
            {MOCK_PERSONAL_CHALLENGES.map((challenge) => (
              <ChallengeStatus
                key={challenge.id}
                title={challenge.title}
                description={challenge.description}
                difficulty={challenge.difficulty}
                completedDays={challenge.completedDays}
                totalDays={challenge.totalDays}
                participants={challenge.participants}
                daysUntilEnd={challenge.daysUntilEnd}
                rewardXp={challenge.rewardXp}
                isPinned={challenge.isPinned}
                isFailed={challenge.isFailed}
                className="bg-white shadow-sm border border-gray-200"
              />
            ))}
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
        <Leaderboard items={MOCK_LEADERBOARD} />
        <MyStats
          completedChallenges={MOCK_STATS.completedChallenges}
          badges={MOCK_STATS.badges}
          totalXp={MOCK_STATS.totalXp}
        />
      </aside>
    </>
  );

  // ─── 스쿼드 챌린지 렌더링 ───

  const renderSquadTab = () => {
    // 로딩 상태
    if (squadLoading) {
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

    // 데이터 로드 완료 — 성공한 것만 렌더링
    return (
      <>
        {/* 왼쪽: 스쿼드 컨텐츠 */}
        <section className="flex-1 flex flex-col gap-6">
          {mySquadData && (
            <SquadWeeklyBattle mySquad={mySquadData} rivalSquad={rivalSquad} />
          )}
          {squadRanking.length > 0 && (
            <SquadRanking
              items={squadRanking}
              mySquadId={mySquadId}
              onViewAll={() => setShowRankingModal(true)}
            />
          )}
          {squadContributions.length > 0 && (
            <SquadMVP
              items={squadContributions}
              onViewAll={() => setShowContributionModal(true)}
            />
          )}
        </section>

        {/* 오른쪽: 학교 정보 패널 */}
        <aside className="w-[360px] shrink-0">
          {mySquadData && (
            <SquadInfoPanel
              squadName={mySquadData.squadName}
              currentRanking={mySquadData.currentRanking}
              weeklyXpChangeRate={mySquadData.weeklyXpChangeRate}
              myContributionPercentile={myContributionPercentile}
            />
          )}
        </aside>
      </>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="flex flex-col px-32 py-10 gap-10">


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
