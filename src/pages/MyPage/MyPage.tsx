import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TotalAssets, MyPortfolio } from "@/components";
import { PortfolioPerformance } from "@/components/PortfolioPerformance";
import SettingsIcon from "@/assets/svgs/SettingsIcon";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import ShieldIcon from "@/assets/svgs/ShieldIcon";
import BookIcon from "@/assets/svgs/BookIcon";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import CartIcon from "@/assets/svgs/CartIcon";
import { assetPortfolioApi, type PortfolioGroup } from "@/api/asset";
import GraphIcon from "@/assets/svgs/GraphIcon";

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  // TODO: API 연동 시 교체
  const learningProgress = 65; // %
  const achievedChallenges = 12;
  const totalChallenges = 20;
  const nextBadgeCount = 2;
  const communityRank = 247;
  const communityTopPercent = 15;
  const communityXp = 11_230;

  const [allocation, setAllocation] = useState<{
    totalAmount: number;
    changeRate: number;
  } | null>(null);

  // 포트폴리오 그룹(폴더) 목록
  // - null: 로딩/미시도
  // - []: 실패 또는 데이터 없음 (요청: 더미 대신 비어있게)
  const [portfolioGroups, setPortfolioGroups] = useState<PortfolioGroup[] | null>(null);
  const totalAssets = allocation?.totalAmount ?? null;
  const totalChangeRate = allocation?.changeRate ?? null;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await assetPortfolioApi.getAssetAllocation();
        if (!alive) return;
        setAllocation({
          totalAmount: data.totalAmount,
          changeRate: data.changeRate,
        });
      } catch {
        // 실패 시 로딩 표시 유지
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

  // 제한 없이 그대로 노출
  const myPortfolioGroups = portfolioGroups ?? [];

  const getPortfolioIcon = (iconCode: string) => {
    switch (iconCode) {
      case "ICON_02":
        return ShieldIcon;
      case "ICON_03":
        return GraphIcon;
      case "ICON_01":
      default:
        return ChangeRateIcon;
    }
  };

  // 그룹 조회 API에서 수익률(totalReturnRate) 제공

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
              className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 text-left"
              onClick={() => navigate("/ai-learning")}
              aria-label="학습 진행률 상세 보기"
            >
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
            </button>

            {/* 달성 챌린지 (Figma: 2123:34002) */}
            <button
              type="button"
              className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 whitespace-pre-wrap text-left"
              onClick={() => navigate("/mypage/challenges")}
              aria-label="달성 챌린지 상세 보기"
            >
              <p className="text-[18px] leading-[17px] font-normal text-black">달성 챌린지</p>
              <div className="flex flex-col gap-2.5 w-full">
                <p className="text-Title_L_Medium text-main-1">
                  {achievedChallenges}/{totalChallenges}
                </p>
                <p className="text-[16px] leading-[17px] font-normal text-[#747474]">
                  다음 배지까지 {nextBadgeCount}개
                </p>
              </div>
            </button>

            {/* 커뮤니티 랭킹 (Figma: 2123:34007) */}
            <button
              type="button"
              className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 whitespace-pre-wrap text-left"
              onClick={() => navigate("/mypage/service-ranking")}
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
          <PortfolioPerformance />

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
                    changeRate={g.totalReturnRate ?? 0}
                    icon={getPortfolioIcon(g.iconCode)}
                    iconClassName="text-sub-blue"
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


