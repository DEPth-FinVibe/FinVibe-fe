import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import GrayProfileIcon from "@/assets/svgs/GrayProfileIcon";
import { Button } from "@/components";
import ServiceRankingRow, {
  type ServiceRankingRowModel,
} from "@/pages/ServiceRanking/components/ServiceRankingRow";
import {
  assetPortfolioApi,
  type UserProfitRankingItem,
} from "@/api/asset";
import {
  gamificationApi,
  type UserRankingItem,
} from "@/api/gamification/gamification";
import { useAuthStore } from "@/store/useAuthStore";

type RankingType = "return" | "xp";
type PeriodType = "weekly" | "monthly";

const PERIOD_TO_PROFIT_API: Record<PeriodType, "WEEKLY" | "MONTHLY"> = {
  weekly: "WEEKLY",
  monthly: "MONTHLY",
};

const formatRate = (rate: number) =>
  `${rate >= 0 ? "+" : ""}${rate.toFixed(1)}%`;

const formatAmount = (amount: number) =>
  `₩${Math.abs(amount).toLocaleString()}`;

const formatXp = (xp: number) => `${xp.toLocaleString()} XP`;

const ServiceRankingPage: React.FC = () => {
  const navigate = useNavigate();
  const [rankingType, setRankingType] = useState<RankingType>("return");
  const [period, setPeriod] = useState<PeriodType>("weekly");
  const [profitItems, setProfitItems] = useState<UserProfitRankingItem[]>([]);
  const [xpItems, setXpItems] = useState<UserRankingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);

  const fetchProfitRanking = useCallback(async (p: PeriodType) => {
    setLoading(true);
    try {
      const data = await assetPortfolioApi.getUserProfitRanking(PERIOD_TO_PROFIT_API[p]);
      setProfitItems(data.items ?? []);
    } catch {
      setProfitItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchXpRanking = useCallback(async (p: PeriodType) => {
    setLoading(true);
    try {
      const data = await gamificationApi.getUserXpRanking(
        PERIOD_TO_PROFIT_API[p],
        50,
      );
      setXpItems(data);
    } catch {
      setXpItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (rankingType === "return") {
      fetchProfitRanking(period);
    } else {
      fetchXpRanking(period);
    }
  }, [rankingType, period, fetchProfitRanking, fetchXpRanking]);

  // 내 랭킹 정보
  const myProfitItem = useMemo(() => {
    if (!user) return null;
    return profitItems.find((item) => item.userId === user.userId) ?? null;
  }, [profitItems, user]);

  const myXpItem = useMemo(() => {
    if (!user) return null;
    return xpItems.find((item) => item.userId === user.userId) ?? null;
  }, [xpItems, user]);

  const myRank = rankingType === "return"
    ? myProfitItem?.rank ?? null
    : myXpItem?.ranking ?? null;

  const totalCount = rankingType === "return" ? profitItems.length : xpItems.length;

  // 공통 row 모델 생성
  const rows = useMemo<ServiceRankingRowModel[]>(() => {
    if (rankingType === "return") {
      return profitItems.map((item) => ({
        rank: item.rank,
        name: item.userId.slice(0, 8),
        changeRateText: formatRate(item.returnRate),
        amountText: formatAmount(item.profitLoss),
        variant: item.rank <= 3 ? "top3" as const : "normal" as const,
      }));
    }
    return xpItems.map((item) => ({
      rank: item.ranking,
      name: item.nickname || item.userId.slice(0, 8),
      changeRateText: formatXp(item.periodXp),
      amountText: `총 ${formatXp(item.currentXp)}`,
      variant: item.ranking <= 3 ? "top3" as const : "normal" as const,
    }));
  }, [profitItems, xpItems, rankingType]);

  const handleRowClick = (row: ServiceRankingRowModel) => {
    if (rankingType === "return") {
      const item = profitItems.find((i) => i.rank === row.rank);
      navigate("/mypage/service-ranking/user", {
        state: {
          rankingType: "return",
          name: row.name,
          rank: row.rank,
          returnRate: item?.returnRate ?? 0,
          profitLoss: item?.profitLoss ?? 0,
        },
      });
    } else {
      const item = xpItems.find((i) => i.ranking === row.rank);
      navigate("/mypage/service-ranking/user", {
        state: {
          rankingType: "xp",
          name: row.name,
          rank: row.rank,
          currentXp: item?.currentXp ?? 0,
          periodXp: item?.periodXp ?? 0,
          growthRate: item?.growthRate ?? 0,
        },
      });
    }
  };

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
                "!text-white",
                "!border-none",
                rankingType === "return"
                  ? "!bg-main-1 hover:!bg-main-1"
                  : "!bg-gray-200 hover:!bg-gray-300"
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
                "!text-white",
                "!border-none",
                rankingType === "xp"
                  ? "!bg-main-1 hover:!bg-main-1"
                  : "!bg-gray-200 hover:!bg-gray-300"
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
                <p className="text-Subtitle_L_Medium text-main-1">
                  {myRank != null ? `${myRank}위` : "-"}
                </p>
              </div>

              <div className="size-[60px] rounded-full bg-white flex items-center justify-center border border-gray-300">
                <GrayProfileIcon className="w-8 h-9" ariaLabel="프로필" />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-Subtitle_L_Medium text-black">
                  {user?.nickname ?? "-"}
                </p>
                <p className="text-Subtitle_S_Regular text-[#747474]">
                  {myRank != null && totalCount > 0
                    ? `상위 ${Math.max(1, Math.round((myRank / totalCount) * 100))}%`
                    : "-"}
                </p>
              </div>
            </div>

            {rankingType === "return" ? (
              <div className={cn(
                "text-right text-Title_L_Medium whitespace-nowrap",
                myProfitItem && myProfitItem.returnRate >= 0 ? "text-etc-red" : "text-sub-blue"
              )}>
                <p className="mb-0">
                  {myProfitItem ? formatRate(myProfitItem.returnRate) : "-"}
                </p>
                <p>
                  {myProfitItem ? formatAmount(myProfitItem.profitLoss) : "-"}
                </p>
              </div>
            ) : (
              <div className="text-right text-Title_L_Medium whitespace-nowrap text-main-1">
                <p className="mb-0">
                  {myXpItem ? formatXp(myXpItem.periodXp) : "-"}
                </p>
                <p className="text-Subtitle_S_Regular text-[#747474]">
                  {myXpItem ? `총 ${formatXp(myXpItem.currentXp)}` : "-"}
                </p>
              </div>
            )}
          </section>

          {/* 랭킹 리스트 */}
          <section className="w-full flex flex-col gap-2.5">
            {loading ? (
              <div className="py-10 text-center text-gray-400">랭킹을 불러오는 중...</div>
            ) : rows.length === 0 ? (
              <div className="py-10 text-center text-gray-400">랭킹 데이터가 없습니다.</div>
            ) : (
              rows.map((r) => (
                <ServiceRankingRow
                  key={r.rank}
                  item={r}
                  onClick={handleRowClick}
                />
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ServiceRankingPage;
