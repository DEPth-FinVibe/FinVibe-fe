import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import GrayProfileIcon from "@/assets/svgs/GrayProfileIcon";
import { Button } from "@/components";
import ServiceRankingRow, {
  type ServiceRankingRowModel,
} from "@/pages/ServiceRanking/components/ServiceRankingRow";
import { assetRankingApi, type RankingPeriod, type UserProfitRankingItem } from "@/api/asset";
import { gamificationApi, type UserRankingItem, type RankingPeriod as XpRankingPeriod } from "@/api/gamification";
import { useAuthStore } from "@/store/useAuthStore";
import { formatPrice, formatChangeRate } from "@/utils/formatStock";

type RankingType = "return" | "xp";
type PeriodType = "weekly" | "monthly";

const ServiceRankingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rankingType, setRankingType] = useState<RankingType>("return");
  const [period, setPeriod] = useState<PeriodType>("weekly");
  
  // API 상태
  const [rankingData, setRankingData] = useState<UserProfitRankingItem[]>([]);
  const [xpRankingData, setXpRankingData] = useState<UserRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myRanking, setMyRanking] = useState<{
    rank: number;
    returnRate: number;
    profitLoss: number;
  } | null>(null);
  const [myXpRanking, setMyXpRanking] = useState<{
    rank: number;
    currentXp: number;
    periodXp: number;
  } | null>(null);

  // API 호출
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const periodMap: Record<PeriodType, RankingPeriod | XpRankingPeriod> = {
      weekly: "WEEKLY",
      monthly: "MONTHLY",
    };

    if (rankingType === "return") {
      // 수익률 랭킹
      assetRankingApi
        .getUserProfitRanking(periodMap[period] as RankingPeriod, 0, 50)
        .then((data) => {
          if (cancelled) return;
          setRankingData(data.items);
          
          // 내 랭킹 찾기 (현재 사용자 ID로)
          if (user?.userId) {
            const myItem = data.items.find((item) => item.userId === user.userId);
            if (myItem) {
              setMyRanking({
                rank: myItem.rank,
                returnRate: myItem.returnRate,
                profitLoss: myItem.profitLoss,
              });
            }
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setError("랭킹 데이터를 불러오는 중 오류가 발생했습니다.");
          console.error("랭킹 API 오류:", err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      // XP 랭킹
      gamificationApi
        .getUserXpRanking(periodMap[period] as XpRankingPeriod, 50)
        .then((data) => {
          if (cancelled) return;
          setXpRankingData(data);
          
          // 내 랭킹 찾기 (현재 사용자 ID로)
          if (user?.userId) {
            const myItem = data.find((item) => item.userId === user.userId);
            if (myItem) {
              setMyXpRanking({
                rank: myItem.ranking,
                currentXp: myItem.currentXp,
                periodXp: myItem.periodXp,
              });
            }
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setError("랭킹 데이터를 불러오는 중 오류가 발생했습니다.");
          console.error("XP 랭킹 API 오류:", err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [rankingType, period, user?.userId]);

  // 내 랭킹 정보 (API 데이터 또는 기본값)
  const myName = user?.nickname || user?.loginId || "사용자";
  const myRank = rankingType === "return" 
    ? (myRanking?.rank ?? 0)
    : (myXpRanking?.rank ?? 0);
  const myTopPercent = rankingType === "return"
    ? (myRanking ? Math.round((myRanking.rank / (rankingData.length || 1)) * 100) : 0)
    : (myXpRanking ? Math.round((myXpRanking.rank / (xpRankingData.length || 1)) * 100) : 0);
  const myChangeRateText = rankingType === "return"
    ? (myRanking ? formatChangeRate(myRanking.returnRate) : "+0.0%")
    : (myXpRanking ? `${myXpRanking.periodXp.toLocaleString()} XP` : "0 XP");
  const myAmountText = rankingType === "return"
    ? (myRanking ? formatPrice(myRanking.profitLoss) : "0")
    : (myXpRanking ? `${myXpRanking.currentXp.toLocaleString()} XP` : "0 XP");

  // 랭킹 데이터 변환
  const rows = useMemo<ServiceRankingRowModel[]>(() => {
    if (rankingType === "return") {
      // 수익률 랭킹
      return rankingData.map((item) => ({
        rank: item.rank,
        name: item.nickname || item.userId.slice(0, 8) + "...",
        changeRateText: formatChangeRate(item.returnRate),
        amountText: formatPrice(item.profitLoss),
        variant: item.rank <= 3 ? ("top3" as const) : ("normal" as const),
      }));
    } else {
      // XP 랭킹
      return xpRankingData.map((item) => ({
        rank: item.ranking,
        name: item.nickname || item.userId.slice(0, 8) + "...",
        changeRateText: `${item.periodXp.toLocaleString()} XP`,
        amountText: `${item.currentXp.toLocaleString()} XP`,
        variant: item.ranking <= 3 ? ("top3" as const) : ("normal" as const),
      }));
    }
  }, [rankingData, xpRankingData, rankingType]);

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
          {myRank > 0 && (
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
                  <p className="text-Subtitle_S_Regular text-[#747474]">
                    {myTopPercent > 0 ? `상위 ${myTopPercent}%` : "랭킹 정보 없음"}
                  </p>
                </div>
              </div>

              <div className="text-right text-Title_L_Medium text-etc-red whitespace-nowrap">
                <p className="mb-0">{myChangeRateText}</p>
                <p>{myAmountText}</p>
              </div>
            </section>
          )}

          {/* 랭킹 리스트 */}
          <section className="w-full flex flex-col gap-2.5">
            {loading && (
              <div className="w-full py-10 text-center text-Body_L_Regular text-gray-500">
                랭킹을 불러오는 중...
              </div>
            )}
            {error && (
              <div className="w-full py-10 text-center text-Body_L_Regular text-etc-red">
                {error}
              </div>
            )}
            {!loading && !error && rows.length === 0 && (
              <div className="w-full py-10 text-center text-Body_L_Regular text-gray-500">
                랭킹 데이터가 없습니다.
              </div>
            )}
            {!loading && !error && rows.map((r) => (
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


