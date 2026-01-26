import React from "react";
import { TotalAssets, MyPortfolio } from "@/components";
import { PortfolioPerformance } from "@/components/PortfolioPerformance";
import SettingsIcon from "@/assets/svgs/SettingsIcon";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import ShieldIcon from "@/assets/svgs/ShieldIcon";
import BookIcon from "@/assets/svgs/BookIcon";
import BadgeAwardsIcon from "@/assets/svgs/BadgeAwardsIcon";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import CartIcon from "@/assets/svgs/CartIcon";

const MyPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-[240px] py-[30px]">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[50px]">
          {/* 설정 아이콘 */}
          <div className="flex justify-end">
            <SettingsIcon
              className="w-10 h-10 text-main-1"
              ariaLabel="설정"
              onClick={() => {}}
            />
          </div>

          {/* 상단 카드 4개 */}
          <div className="flex gap-[53px] items-center w-full">
            <div className="w-[320px]">
              <TotalAssets totalAmount={10450000} changeRate={4.5} />
            </div>
            <div className="w-[320px]">
              <TotalAssets totalAmount={10450000} changeRate={4.5} />
            </div>
            <div className="w-[320px]">
              <TotalAssets totalAmount={10450000} changeRate={4.5} />
            </div>
            <div className="w-[320px]">
              <TotalAssets totalAmount={10450000} changeRate={4.5} />
            </div>
          </div>

          {/* 포트폴리오 성과(라인 차트) */}
          <PortfolioPerformance />

          {/* 하단 2열 */}
          <div className="flex gap-5 items-start w-full">
            {/* 최근 활동 */}
            <section className="bg-white border border-gray-300 rounded-lg w-[709px] px-10 pt-10 pb-[50px] flex flex-col gap-10">
              <h2 className="text-Title_L_Medium text-black">최근 활동</h2>

              <div className="flex flex-col gap-[30px] pl-[30px]">
                <div className="flex items-center gap-5">
                  <div className="w-[45px] h-[45px] rounded-full bg-main-1 flex items-center justify-center">
                    <CartIcon className="text-white size-6" />
                  </div>
                  <p className="text-Subtitle_L_Regular text-black">삼성전자 매수</p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-[45px] h-[45px] rounded-full bg-main-1 flex items-center justify-center">
                    <BookIcon className="w-6 h-6" color="#FFFFFF" ariaLabel="학습" />
                  </div>
                  <p className="text-Subtitle_L_Regular text-black">학습 완료</p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="w-[45px] h-[45px] rounded-full bg-main-1 flex items-center justify-center">
                    <BadgeAwardsIcon className="w-6 h-6" color="#FFFFFF" ariaLabel="챌린지" />
                  </div>
                  <p className="text-Subtitle_L_Regular text-black">챌린지 달성</p>
                </div>
              </div>
            </section>

            {/* 나의 포트폴리오 */}
            <section className="bg-white border border-gray-300 rounded-lg w-[710px] px-10 py-[30px] flex flex-col gap-[25px]">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-Subtitle_L_Medium text-black">나의 포트폴리오</h2>
                <button
                  type="button"
                  className="flex items-center gap-1 text-Subtitle_S_Regular text-sub-blue"
                >
                  관리/상세보기
                  <ChevronIcon className="w-[19px] h-[19px] -rotate-90 text-sub-blue" />
                </button>
              </div>

              <div className="flex flex-col gap-5 pl-[15px]">
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


