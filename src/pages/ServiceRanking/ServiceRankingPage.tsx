import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import GrayProfileIcon from "@/assets/svgs/GrayProfileIcon";
import { Button } from "@/components";
import ServiceRankingRow, {
  type ServiceRankingRowModel,
} from "@/pages/ServiceRanking/components/ServiceRankingRow";

type RankingType = "return" | "xp";
type PeriodType = "weekly" | "monthly";

const ServiceRankingPage: React.FC = () => {
  const navigate = useNavigate();
  const [rankingType, setRankingType] = useState<RankingType>("return");
  const [period, setPeriod] = useState<PeriodType>("weekly");

  // TODO: API 연동 시 교체 (현재는 더미)
  const myName = "김민준";
  const myRank = 247;
  const myTopPercent = 15;
  const myChangeRateText = "+12.5%";
  const myAmountText = "000,000";

  const rows = useMemo<ServiceRankingRowModel[]>(
    () => [
      { rank: 1, name: "이서준", changeRateText: "+28.3%", amountText: "000,000", variant: "top3" },
      { rank: 2, name: "박지우", changeRateText: "+24.7%", amountText: "000,000", variant: "top3" },
      { rank: 3, name: "최예은", changeRateText: "+22.1%", amountText: "000,000", variant: "top3" },
      { rank: 4, name: "정도윤", changeRateText: "+19.5%", amountText: "000,000", variant: "normal" },
      { rank: 5, name: "강서연", changeRateText: "+18.2%", amountText: "000,000", variant: "normal" },
      { rank: 6, name: "조민서", changeRateText: "+16.8%", amountText: "000,000", variant: "normal" },
      { rank: 7, name: "윤지호", changeRateText: "+15.4%", amountText: "000,000", variant: "normal" },
      { rank: 8, name: "임하윤", changeRateText: "+14.9%", amountText: "000,000", variant: "normal" },
      { rank: 9, name: "한시우", changeRateText: "+13.7%", amountText: "000,000", variant: "normal" },
      { rank: 10, name: "신은우", changeRateText: "+12.8%", amountText: "000,000", variant: "normal" },
    ],
    []
  );

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
              서비스 랭킹
            </button>
          </div>

          {/* 랭킹 타입 탭 */}
          <div className="flex gap-[30px] items-center">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setRankingType("return")}
              className={cn(
                "!rounded-lg !px-5 !py-3.5 !min-h-0",
                "text-Subtitle_M_Medium",
                "text-white",
                "border-none",
                rankingType === "return"
                  ? "bg-main-1"
                  : "bg-gray-200"
              )}
              aria-pressed={rankingType === "return"}
            >
              💰 수익률 랭킹
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setRankingType("xp")}
              className={cn(
                "!rounded-lg !px-5 !py-3.5 !min-h-0",
                "text-Subtitle_M_Medium",
                "text-white",
                "border-none",
                rankingType === "xp"
                  ? "bg-main-1"
                  : "bg-gray-200"
              )}
              aria-pressed={rankingType === "xp"}
            >
              🔥 XP 랭킹
            </Button>
          </div>

          {/* 기간 탭 */}
          <div className="flex gap-2.5 items-center">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setPeriod("weekly")}
              className={cn(
                // button_S: radius 16px, padding 8px 20px, gap 10px
                "!rounded-2xl !px-5 !py-2 !min-h-0",
                "!gap-2.5",
                "!border !border-sub-blue",
                "text-[16px] leading-[17px] font-medium",
                period === "weekly"
                  ? "!bg-sub-blue !text-white"
                  : "!bg-white !text-sub-blue"
              )}
              aria-pressed={period === "weekly"}
            >
              주간
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setPeriod("monthly")}
              className={cn(
                "!rounded-2xl !px-5 !py-2 !min-h-0",
                "!gap-2.5",
                "!border !border-sub-blue",
                "text-[16px] leading-[17px] font-medium",
                period === "monthly"
                  ? "!bg-sub-blue !text-white"
                  : "!bg-white !text-sub-blue"
              )}
              aria-pressed={period === "monthly"}
            >
              월간
            </Button>
          </div>

          {/* 내 랭킹 카드 */}
          <section className="w-full rounded-2xl bg-etc-light-mint border border-main-1 px-10 py-7.5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="size-[90px] rounded-full bg-white border border-main-1 flex items-center justify-center">
                <p className="text-Subtitle_L_Medium text-main-1">{myRank}위</p>
              </div>

              <div className="size-[60px] rounded-full bg-white flex items-center justify-center border border-gray-300">
                <GrayProfileIcon className="w-8 h-9" ariaLabel="프로필" />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-Subtitle_L_Medium text-black">{myName}</p>
                <p className="text-Subtitle_S_Regular text-[#747474]">상위 {myTopPercent}%</p>
              </div>
            </div>

            <div className="text-right text-Title_L_Medium text-etc-red whitespace-nowrap">
              <p className="mb-0">{myChangeRateText}</p>
              <p>{myAmountText}</p>
            </div>
          </section>

          {/* 랭킹 리스트 */}
          <section className="w-full flex flex-col gap-2.5">
            {rows.map((r) => (
              <ServiceRankingRow
                key={r.rank}
                item={r}
                onClick={(item) =>
                  navigate("/mypage/service-ranking/user", {
                    state: {
                      name: item.name,
                      rankText: `${item.rank}위`,
                      returnText: item.changeRateText,
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
                    },
                  })
                }
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ServiceRankingPage;


