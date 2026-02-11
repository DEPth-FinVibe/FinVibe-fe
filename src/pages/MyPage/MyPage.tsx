import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotalAssets, MyPortfolio } from "@/components";
import SettingsIcon from "@/assets/svgs/SettingsIcon";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import BookIcon from "@/assets/svgs/BookIcon";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";
import CartIcon from "@/assets/svgs/CartIcon";
import { walletApi } from "@/api/wallet";
import { assetPortfolioApi, type PortfolioGroup, type AssetAllocationResponse } from "@/api/asset";
import { gamificationApi } from "@/api/gamification";
import { studyApi } from "@/api/study";
import { ALL_BADGE_TYPES } from "@/components/Badge/badgeConfig";
import { useAuthStore } from "@/store/useAuthStore";
import { useRecentActivity, formatRelativeTime } from "@/hooks/useRecentActivity";
import PortfolioPerformanceWrapper from "./components/PortfolioPerformanceWrapper";

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [allocation, setAllocation] = useState<AssetAllocationResponse | null>(null);
  const [cash, setCash] = useState<number | null>(null);
  
  // 커뮤니티 랭킹 정보
  const [communityRank, setCommunityRank] = useState<number | null>(null);
  const [communityTopPercent, setCommunityTopPercent] = useState<number | null>(null);
  const [communityXp, setCommunityXp] = useState<number | null>(null);
  
  // 학습 진행률
  const [learningProgress, setLearningProgress] = useState<number | null>(null);

  // 포트폴리오 그룹(폴더) 목록
  // - null: 로딩/미시도
  // - []: 실패 또는 데이터 없음 (요청: 더미 대신 비어있게)
  const [portfolioGroups, setPortfolioGroups] = useState<PortfolioGroup[] | null>(null);

  // 챌린지 데이터
  const [challenges, setChallenges] = useState<number[] | null>(null); // [달성완료 수, 진행중+달성완료 수]
  
  // 미획득 배지 수
  const [unacquiredBadgeCount, setUnacquiredBadgeCount] = useState<number | null>(null);
  
  // API 데이터 또는 기본값
  const totalAssets = allocation?.totalAmount ?? (cash !== null ? (cash + (allocation?.stockAmount ?? 0)) : null);
  const totalChangeRate = allocation?.changeRate ?? null;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [allocationData, balanceData] = await Promise.all([
          assetPortfolioApi.getAssetAllocation(),
          walletApi.getBalance(),
        ]);
        if (!alive) return;
        setAllocation(allocationData);
        setCash(Number.isFinite(balanceData.balance) ? Math.max(0, balanceData.balance) : 0);
      } catch {
        // 실패 시 로딩 표시 유지
        if (!alive) return;
        setAllocation(null);
        setCash(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const groups = await assetPortfolioApi.getPortfolios();
        if (!alive) return;
        setPortfolioGroups(Array.isArray(groups) ? groups : []);
      } catch {
        // 실패 시 더미 대신 비어있게
        if (!alive) return;
        setPortfolioGroups([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const myChallenges = await gamificationApi.getMyChallenges();
        if (!alive) return;
        
        // 달성완료 수
        const completedCount = myChallenges.filter((c) => c.achieved).length;
        // 진행중+달성완료 수 (전체 챌린지 수)
        const totalActiveCount = myChallenges.length;
        
        setChallenges([completedCount, totalActiveCount]);
      } catch {
        // 실패 시 0으로 설정
        if (!alive) return;
        setChallenges([0, 0]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const myBadges = await gamificationApi.getMyBadges();
        if (!alive) return;
        
        // 획득한 배지 타입 Set 생성
        const acquiredBadgeTypes = new Set(myBadges.map((badge) => badge.badge));
        
        // 미획득한 배지 수 계산
        const unacquiredCount = ALL_BADGE_TYPES.filter(
          (badgeType) => !acquiredBadgeTypes.has(badgeType)
        ).length;
        
        setUnacquiredBadgeCount(unacquiredCount);
      } catch {
        // 실패 시 전체 배지 수로 설정 (모두 미획득으로 간주)
        if (!alive) return;
        setUnacquiredBadgeCount(ALL_BADGE_TYPES.length);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 학습 진행률 계산
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const courses = await studyApi.getMyCourses();
        if (!alive) return;
        
        // 전체 레슨 수와 완료한 레슨 수 계산
        const totalLessons = courses.reduce((sum, c) => sum + c.totalLessonCount, 0);
        const completedLessons = courses.reduce(
          (sum, c) => sum + c.lessons.filter((l) => l.completed).length,
          0
        );
        
        // 학습할 것이 없으면 (totalLessons === 0) null로 설정하여 "-" 표시
        // 학습할 것이 있으면 퍼센트 계산
        const progress = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100)
          : null;
        
        setLearningProgress(progress);
      } catch {
        // 실패 시 null로 유지 (로딩 상태)
        if (!alive) return;
        setLearningProgress(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 커뮤니티 랭킹 정보 조회
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // XP 랭킹 조회 (주간 기준)
        const xpRankingData = await gamificationApi.getUserXpRanking("WEEKLY", 50);
        if (!alive) return;
        
        // 내 랭킹 찾기
        if (user?.userId) {
          const myItem = xpRankingData.find((item) => item.userId === user.userId);
          if (myItem) {
            setCommunityRank(myItem.ranking);
            setCommunityXp(myItem.currentXp);
            
            // 상위 퍼센트 계산
            const topPercent = xpRankingData.length > 0
              ? Math.round((myItem.ranking / xpRankingData.length) * 100)
              : null;
            setCommunityTopPercent(topPercent);
          } else {
            // 랭킹에 없으면 null로 설정
            setCommunityRank(null);
            setCommunityTopPercent(null);
            setCommunityXp(null);
          }
        }
      } catch {
        // 실패 시 null로 유지
        if (!alive) return;
        setCommunityRank(null);
        setCommunityTopPercent(null);
        setCommunityXp(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user?.userId]);

  // 최근 활동
  const { data: recentActivities = [], isLoading: isActivityLoading } = useRecentActivity();

  // 제한 없이 그대로 노출
  const myPortfolioGroups = portfolioGroups ?? [];

  // NOTE: 그룹 조회 API에는 수익률/차트 데이터가 없어서 임시로 0/undefined 처리

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-60 py-8">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12">
          {/* 설정 아이콘 */}
          <div className="flex justify-end">
            <SettingsIcon
              className="w-10 h-10 text-main-1"
              ariaLabel="설정"
              onClick={() => navigate("/mypage/settings")}
            />
          </div>

          {/* 상단 카드 4개 */}
          <div className="flex gap-[53px] items-center w-full">
            <button
              type="button"
              className="w-80 h-38 text-left"
              onClick={() => navigate("/mypage/assets")}
              aria-label="총자산 상세 보기"
            >
              <TotalAssets totalAmount={totalAssets} changeRate={totalChangeRate} />
            </button>

            {/* 학습 진행률 (Figma: 2123:33997) */}
            <button
              type="button"
              onClick={() => navigate("/ai-learning")}
              className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 whitespace-pre-wrap hover:bg-gray-50 transition-colors cursor-pointer text-left"
              aria-label="AI 투자 학습 페이지로 이동"
            >
              <p className="text-[18px] leading-[17px] font-normal text-black">학습 진행률</p>
              <div className="flex flex-col gap-[25px] w-full">
                <p className="text-Title_L_Medium text-main-1">
                  {learningProgress !== null ? `${learningProgress}%` : "-"}
                </p>
                <div className="w-[260px]">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-main-1 rounded-full"
                      style={{ width: `${Math.max(0, Math.min(100, learningProgress ?? 0))}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>

            {/* 달성 챌린지 (Figma: 2123:34002) */}
            <button
              type="button"
              onClick={() => navigate("/mypage/challenge-history")}
              className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 whitespace-pre-wrap hover:bg-gray-50 transition-colors cursor-pointer text-left"
              aria-label="달성 챌린지 상세 보기"
            >
              <p className="text-[18px] leading-[17px] font-normal text-black">달성 챌린지</p>
              <div className="flex flex-col gap-2.5 w-full">
                <p className="text-Title_L_Medium text-main-1">
                  {challenges ? `${challenges[0]}/${challenges[1]}` : "0/0"}
                </p>
                <p className="text-[16px] leading-[17px] font-normal text-[#747474]">
                  {unacquiredBadgeCount ?? 0}개 뱃지 미획득
                </p>
              </div>
            </button>

            {/* 커뮤니티 랭킹 (Figma: 2123:34007) */}
            <button
              type="button"
              onClick={() => navigate("/mypage/service-ranking")}
              className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 whitespace-pre-wrap hover:bg-gray-50 transition-colors cursor-pointer text-left"
              aria-label="커뮤니티 랭킹 상세 보기"
            >
              <p className="text-[18px] leading-[17px] font-normal text-black">커뮤니티 랭킹</p>
              <div className="flex flex-col gap-2.5 w-full">
                <p className="text-Title_L_Medium text-main-1">
                  {communityRank !== null ? `#${communityRank}` : "-"}
                </p>
                <div className="flex flex-col gap-1 text-[16px] leading-[17px] font-normal text-[#747474]">
                  <p>
                    {communityTopPercent !== null ? `상위 ${communityTopPercent}%` : "랭킹 정보 없음"}
                  </p>
                  <p>
                    {communityXp !== null ? `${communityXp.toLocaleString()} XP` : "-"}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* 포트폴리오 성과(라인 차트) */}
          <PortfolioPerformanceWrapper />

          {/* 하단 2열 */}
          <div className="flex gap-5 items-stretch w-full">
            {/* 최근 활동 */}
            <section className="bg-white border border-gray-300 rounded-lg w-[709px] px-10 pt-10 pb-12 flex flex-col gap-10">
              <h2 className="text-Title_L_Medium text-black">최근 활동</h2>

              <div className="flex flex-col gap-8 pl-8">
                {isActivityLoading ? (
                  <p className="text-Subtitle_L_Regular text-gray-400">불러오는 중...</p>
                ) : recentActivities.length === 0 ? (
                  <p className="text-Subtitle_L_Regular text-gray-400">최근 활동이 없습니다</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-5">
                      <div className="size-11 rounded-full bg-main-1 flex items-center justify-center shrink-0">
                        {activity.type === "trade" && (
                          <CartIcon className="text-white size-6" />
                        )}
                        {activity.type === "study" && (
                          <BookIcon className="w-6 h-6" color="#FFFFFF" ariaLabel="학습" />
                        )}
                        {activity.type === "challenge" && (
                          <BadgeAwardsIcon className="w-6 h-6" color="#FFFFFF" ariaLabel="챌린지" />
                        )}
                      </div>
                      <p className="text-Subtitle_L_Regular text-black flex-1 truncate">
                        {activity.title}
                      </p>
                      <span className="text-Subtitle_S_Regular text-gray-400 shrink-0">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* 나의 포트폴리오 */}
            <section className="bg-white border border-gray-300 rounded-lg w-[710px] px-10 py-8 flex flex-col gap-6">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-Subtitle_L_Medium text-black">나의 포트폴리오</h2>
                <button
                  type="button"
                  onClick={() => navigate("/mypage/portfolio")}
                  className="flex items-center gap-1 text-Subtitle_S_Regular text-sub-blue"
                >
                  관리/상세보기
                  <ChevronIcon className="size-5 -rotate-90 text-sub-blue" />
                </button>
              </div>

              <div className="flex flex-col gap-5 pl-4">
                {myPortfolioGroups.map((g) => (
                  <MyPortfolio
                    key={g.id}
                    title={g.name}
                    changeRate={g.totalReturnRate}
                    chartData={undefined}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPage;

