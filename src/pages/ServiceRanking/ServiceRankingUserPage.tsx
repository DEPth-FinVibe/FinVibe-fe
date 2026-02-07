import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShieldIcon from "@/assets/svgs/ShieldIcon";
import TargetIcon from "@/assets/svgs/TargetIcon";
import { cn } from "@/utils/cn";

type Strategy = {
  icon: "target" | "shield";
  title: string;
  description: string;
  returnText: string; // 예: +55.0%
};

type UserDetailState = {
  name: string;
  rankText: string; // 예: 3위
  returnText: string; // 예: +42.5%
  xpText: string; // 예: 15,400 XP
  badgeText: string; // 예: 🔥 상위 1% 트레이더
  strategies: Strategy[];
  activities: string[];
};

const ServiceRankingUserPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as UserDetailState | null;

  const data = useMemo<UserDetailState>(() => {
    if (state) return state;

    return {
      name: "주식왕 핀봇",
      rankText: "3위",
      returnText: "+42.5%",
      xpText: "15,400 XP",
      badgeText: "🔥 상위 1% 트레이더",
      strategies: [
        {
          icon: "target",
          title: "반도체 집중",
          description: "삼성전자 (30%), SK하이닉스 (25%)",
          returnText: "+55.0%",
        },
        {
          icon: "shield",
          title: "배당주 방어",
          description: "맥쿼리인프라 (15%), 리츠 (10%)",
          returnText: "+5.2%",
        },
      ],
      activities: ["2시간 전 삼성전자 매도", "어제 카카오 매수"],
    };
  }, [state]);

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
                ←
              </span>
              랭킹으로 돌아가기
            </button>
          </div>

          {/* 유저 카드 */}
          <section className="w-full bg-white border border-gray-300 rounded-lg p-10 flex items-start gap-[30px]">
            <div className="size-[120px] rounded-full bg-gray-300" aria-hidden="true" />

            <div className="flex flex-col gap-4 items-start">
              <div className="flex flex-col gap-5 items-start">
                <p className="text-Headline_M_Bold text-black">
                  {data.name}
                </p>
                <p className="text-Subtitle_L_Medium text-[#747474]">
                  보유 배지
                </p>
              </div>

              <div className="flex items-center">
                <div className="bg-white border border-main-1 rounded-[30px] px-5 py-3.5">
                  <p className="text-Subtitle_S_Regular text-main-1 whitespace-nowrap">
                    {data.badgeText}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-[30px] text-Subtitle_S_Regular">
                <div className="flex flex-col gap-2 items-start w-[30px]">
                  <p className="text-[#747474]">순위</p>
                  <p className="text-black">{data.rankText}</p>
                </div>
                <div className="flex flex-col gap-2 items-start w-[56px]">
                  <p className="text-[#747474]">수익률</p>
                  <p className="text-etc-red">{data.returnText}</p>
                </div>
                <div className="flex flex-col gap-2 items-start w-[73px]">
                  <p className="text-[#747474]">XP</p>
                  <p className="text-black">{data.xpText}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 투자 전략 */}
          <div className="w-full py-2.5 flex items-center">
            <h2 className="text-Title_L_Medium text-black">
              {data.name}님의 투자 전략
            </h2>
          </div>

          <section className="w-full flex flex-col gap-[15px]">
            {data.strategies.map((s, idx) => {
              const Icon = s.icon === "target" ? TargetIcon : ShieldIcon;
              return (
                <div
                  key={`${s.title}-${idx}`}
                  className="w-full bg-white border border-gray-300 rounded-lg px-10 py-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <Icon
                      className={cn(
                        "w-6 h-[26px] shrink-0",
                        s.icon === "target" ? "text-black" : "text-black"
                      )}
                      ariaLabel={s.title}
                    />
                    <div className="w-[270px] flex flex-col gap-2.5">
                      <p className="text-Subtitle_M_Regular text-black">
                        {s.title}
                      </p>
                      <p className="text-Subtitle_M_Regular text-[#747474]">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  <p className="text-Subtitle_M_Regular text-etc-red whitespace-nowrap">
                    {s.returnText}
                  </p>
                </div>
              );
            })}
          </section>

          {/* 최근 활동 */}
          <div className="w-full py-2.5 flex items-center">
            <h2 className="text-Title_L_Medium text-black">최근 활동</h2>
          </div>

          <section className="w-full">
            <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
              {data.activities.map((a, i) => (
                <div
                  key={`${a}-${i}`}
                  className={cn(
                    "w-full px-10 py-[25px] flex items-center",
                    i !== data.activities.length - 1 && "border-b border-gray-300"
                  )}
                >
                  <p className="text-Subtitle_M_Regular text-black">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ServiceRankingUserPage;


