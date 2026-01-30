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
import { walletApi } from "@/api/wallet";

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

  // TODO: 주식 평가금/변화율 API 연동 시 교체
  const stock = 8_000_000;
  const changeRate = 4.5;
  const [cash, setCash] = useState<number | null>(null);
  const totalAssets = cash === null ? null : cash + stock;
  const totalChangeRate = totalAssets === null ? null : changeRate;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await walletApi.getBalance();
        if (!alive) return;
        setCash(Number.isFinite(data.balance) ? Math.max(0, data.balance) : 0);
      } catch {
        // 실패 시 로딩 표시 유지
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

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
            <div className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 whitespace-pre-wrap">
              <p className="text-[18px] leading-[17px] font-normal text-black">달성 챌린지</p>
              <div className="flex flex-col gap-2.5 w-full">
                <p className="text-Title_L_Medium text-main-1">
                  {achievedChallenges}/{totalChallenges}
                </p>
                <p className="text-[16px] leading-[17px] font-normal text-[#747474]">
                  다음 배지까지 {nextBadgeCount}개
                </p>
              </div>
            </div>

            {/* 커뮤니티 랭킹 (Figma: 2123:34007) */}
            <div className="bg-white border border-gray-300 rounded-lg w-80 h-38 px-7.5 py-5 flex flex-col items-start gap-5 whitespace-pre-wrap">
              <p className="text-[18px] leading-[17px] font-normal text-black">커뮤니티 랭킹</p>
              <div className="flex flex-col gap-2.5 w-full">
                <p className="text-Title_L_Medium text-main-1">#{communityRank}</p>
                <div className="flex flex-col gap-1 text-[16px] leading-[17px] font-normal text-[#747474]">
                  <p>상위 {communityTopPercent}%</p>
                  <p>{communityXp.toLocaleString()} XP</p>
                </div>
              </div>
            </div>
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
                <MyPortfolio
                  title="주력 성장주"
                  changeRate={15.2}
                  icon={ChangeRateIcon}
                  iconClassName="text-sub-blue"
                  chartData={[30, 100, 60, 58, 80, 93, 70, 80, 89, 78, 54, 72]}
                />
                <MyPortfolio
                  title="안전 자산"
                  changeRate={-1.4}
                  icon={ShieldIcon}
                  iconClassName="text-sub-blue"
                  chartData={[40, 50, 55, 35, 54, 56, 50, 30, 40, 27, 36, 56]}
                />
                <MyPortfolio
                  title="단타 연습"
                  changeRate={3.0}
                  icon={ChangeRateIcon}
                  iconClassName="text-sub-blue"
                  chartData={[60, 20, 40, 35, 62, 58, 68, 45, 28, 60, 70, 58]}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPage;


