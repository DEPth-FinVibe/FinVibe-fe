import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import GrayProfileIcon from "@/assets/svgs/GrayProfileIcon";

type ReturnRankingState = {
  rankingType: "return";
  name: string;
  rank: number;
  returnRate: number;
  profitLoss: number;
};

type XpRankingState = {
  rankingType: "xp";
  name: string;
  rank: number;
  currentXp: number;
  periodXp: number;
  growthRate: number;
};

type UserDetailState = ReturnRankingState | XpRankingState;

const formatRate = (rate: number) =>
  `${rate >= 0 ? "+" : ""}${rate.toFixed(1)}%`;

const formatAmount = (amount: number) =>
  `₩${Math.abs(amount).toLocaleString()}`;

const formatXp = (xp: number) => `${xp.toLocaleString()} XP`;

const ServiceRankingUserPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as UserDetailState | null;

  if (!state) {
    return (
      <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
        <main className="px-8 2xl:px-60 py-5">
          <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[30px] py-5">
            <div className="w-full px-12 py-2.5 flex items-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-5 text-Headline_L_Bold text-black"
              >
                <span
                  className="w-8 h-8 flex items-center justify-center text-Headline_L_Bold leading-none"
                  aria-hidden="true"
                >
                  &larr;
                </span>
                랭킹으로 돌아가기
              </button>
            </div>
            <div className="py-10 text-center text-gray-400">유저 정보가 없습니다.</div>
          </div>
        </main>
      </div>
    );
  }

  const isReturn = state.rankingType === "return";

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-60 py-5">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-[30px] py-5">
          {/* 타이틀 */}
          <div className="w-full px-12 py-2.5 flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-5 text-Headline_L_Bold text-black"
            >
              <span
                className="w-8 h-8 flex items-center justify-center text-Headline_L_Bold leading-none"
                aria-hidden="true"
              >
                &larr;
              </span>
              랭킹으로 돌아가기
            </button>
          </div>

          {/* 유저 카드 */}
          <section className="w-full bg-white border border-gray-300 rounded-lg p-10 flex items-start gap-[30px]">
            <div className="size-[120px] rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <GrayProfileIcon className="w-14 h-16" ariaLabel="프로필" />
            </div>

            <div className="flex flex-col gap-5 flex-1">
              <p className="text-Headline_M_Bold text-black">{state.name}</p>

              {isReturn ? (
                <div className="flex items-center gap-[30px] text-Subtitle_S_Regular">
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-[#747474]">순위</p>
                    <p className="text-black">{state.rank}위</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-[#747474]">수익률</p>
                    <p className={cn(
                      state.returnRate >= 0 ? "text-etc-red" : "text-sub-blue"
                    )}>
                      {formatRate(state.returnRate)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-[#747474]">손익</p>
                    <p className={cn(
                      state.profitLoss >= 0 ? "text-etc-red" : "text-sub-blue"
                    )}>
                      {formatAmount(state.profitLoss)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-[30px] text-Subtitle_S_Regular">
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-[#747474]">순위</p>
                    <p className="text-black">{state.rank}위</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-[#747474]">기간 XP</p>
                    <p className="text-main-1">{formatXp(state.periodXp)}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-[#747474]">총 XP</p>
                    <p className="text-black">{formatXp(state.currentXp)}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-[#747474]">성장률</p>
                    <p className={cn(
                      state.growthRate >= 0 ? "text-etc-red" : "text-sub-blue"
                    )}>
                      {formatRate(state.growthRate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 랭킹 요약 카드 */}
          <section className="w-full grid grid-cols-2 gap-5">
            {isReturn ? (
              <>
                <div className="bg-white border border-gray-300 rounded-lg p-8 flex flex-col gap-3">
                  <p className="text-Subtitle_S_Regular text-[#747474]">수익률</p>
                  <p className={cn(
                    "text-Title_L_Medium",
                    state.returnRate >= 0 ? "text-etc-red" : "text-sub-blue"
                  )}>
                    {formatRate(state.returnRate)}
                  </p>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-8 flex flex-col gap-3">
                  <p className="text-Subtitle_S_Regular text-[#747474]">실현 손익</p>
                  <p className={cn(
                    "text-Title_L_Medium",
                    state.profitLoss >= 0 ? "text-etc-red" : "text-sub-blue"
                  )}>
                    {state.profitLoss >= 0 ? "+" : "-"}{formatAmount(state.profitLoss)}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white border border-gray-300 rounded-lg p-8 flex flex-col gap-3">
                  <p className="text-Subtitle_S_Regular text-[#747474]">기간 XP</p>
                  <p className="text-Title_L_Medium text-main-1">
                    {formatXp(state.periodXp)}
                  </p>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-8 flex flex-col gap-3">
                  <p className="text-Subtitle_S_Regular text-[#747474]">누적 XP</p>
                  <p className="text-Title_L_Medium text-black">
                    {formatXp(state.currentXp)}
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ServiceRankingUserPage;
