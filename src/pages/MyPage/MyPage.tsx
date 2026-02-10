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
import { ALL_BADGE_TYPES } from "@/components/Badge/badgeConfig";
import PortfolioPerformanceWrapper from "./components/PortfolioPerformanceWrapper";

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  // TODO: API 연동 시 교체
  const learningProgress = 65; // %
  const communityRank = 247;
  const communityTopPercent = 15;
  const communityXp = 11_230;

  const [allocation, setAllocation] = useState<AssetAllocationResponse | null>(null);
  const [cash, setCash] = useState<number | null>(null);

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
            <div className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5">
              <p className="text-[18px] leading-[17px] font-normal text-black">학습 진행률</p>
              <div className="flex flex-col gap-[25px] w-full">
                <p className="text-Title_L_Medium text-main-1">{learningProgress}%</p>
                <div className="w-[260px]">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-main-1 rounded-full"
                      style={{ width: `${Math.max(0, Math.min(100, learningProgress))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

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
                <p className="text-Title_L_Medium text-main-1">#{communityRank}</p>
                <div className="flex flex-col gap-1 text-[16px] leading-[17px] font-normal text-[#747474]">
                  <p>상위 {communityTopPercent}%</p>
                  <p>{communityXp.toLocaleString()} XP</p>
                </div>
              </div>
            </button>
          </div>

          {/* 포트폴리오 성과(라인 차트) */}
          <PortfolioPerformanceWrapper />

          {/* 하단 2열 */}
          <div className="flex gap-5 items-start w-full">
            {/* 최근 활동 */}
            <section className="bg-white border border-gray-300 rounded-lg w-[709px] px-10 pt-10 pb-12 flex flex-col gap-10">
              <h2 className="text-Title_L_Medium text-black">최근 활동</h2>

              <div className="flex flex-col gap-8 pl-8">
                <div className="flex items-center gap-5">
                  <div className="size-11 rounded-full bg-main-1 flex items-center justify-center">
                    <CartIcon className="text-white size-6" />
                  </div>
                  <p className="text-Subtitle_L_Regular text-black">삼성전자 매수</p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="size-11 rounded-full bg-main-1 flex items-center justify-center">
                    <BookIcon className="w-6 h-6" color="#FFFFFF" ariaLabel="학습" />
                  </div>
                  <p className="text-Subtitle_L_Regular text-black">학습 완료</p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="size-11 rounded-full bg-main-1 flex items-center justify-center">
                    <BadgeAwardsIcon className="w-6 h-6" color="#FFFFFF" ariaLabel="챌린지" />
                  </div>
                  <p className="text-Subtitle_L_Regular text-black">챌린지 달성</p>
                </div>
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
                    changeRate={0}
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

