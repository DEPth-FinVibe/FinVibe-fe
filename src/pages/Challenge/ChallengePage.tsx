import { useState } from "react";
import { ChallengeStatus, type ChallengeDifficulty, Leaderboard, MyStats, WeeklyEvent, SwitchBar } from "@/components";

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

// Mock 스쿼드 챌린지 데이터
const MOCK_SQUAD_CHALLENGES = [
  {
    id: 1,
    title: "팀 수익률 대결",
    description: "스쿼드 멤버들과 함께 최고 수익률에 도전하세요",
    difficulty: "보통" as ChallengeDifficulty,
    completedDays: 5,
    totalDays: 14,
    participants: 56,
    daysUntilEnd: 9,
    rewardXp: 300,
    isPinned: true,
    squadName: "투자왕 스쿼드",
    squadMembers: 5,
  },
  {
    id: 2,
    title: "스쿼드 연속 거래 챌린지",
    description: "스쿼드 전원이 매일 1회 이상 거래하기",
    difficulty: "어려움" as ChallengeDifficulty,
    completedDays: 3,
    totalDays: 7,
    participants: 128,
    daysUntilEnd: 4,
    rewardXp: 400,
    isPinned: false,
    squadName: "주식고수들",
    squadMembers: 8,
  },
  {
    id: 3,
    title: "스쿼드 학습 완주",
    description: "스쿼드 멤버 모두 AI 학습 1개 코스 완료",
    difficulty: "쉬움" as ChallengeDifficulty,
    completedDays: 1,
    totalDays: 5,
    participants: 234,
    daysUntilEnd: 12,
    rewardXp: 150,
    isPinned: false,
    squadName: "초보투자자모임",
    squadMembers: 4,
  },
];

const ChallengePage = () => {
  const [activeTab, setActiveTab] = useState<ChallengeTab>("personal");

  const challenges = activeTab === "personal" ? MOCK_PERSONAL_CHALLENGES : MOCK_SQUAD_CHALLENGES;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="flex flex-col px-32 py-10 gap-10">
        

        <div className="flex gap-10">
          {/* 왼쪽: 진행 중인 챌린지 목록 */}
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
                {challenges.map((challenge) => (
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
                    isFailed={(challenge as any).isFailed}
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
        </div>
      </main>
    </div>
  );
};

export default ChallengePage;
