import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "@/components";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import BagIcon from "@/assets/svgs/BagIcon";
import CalendarIcon from "@/assets/svgs/CalendarIcon";
import { cn } from "@/utils/cn";
import { walletApi } from "@/api/wallet";
import { assetPortfolioApi, type AssetAllocationResponse } from "@/api/asset";

const formatWon = (value: number) => `₩${value.toLocaleString()}`;

type TxType = "리워드" | "매수";

type TxItem = {
  title: string;
  type: TxType;
  amountText: string;
  amountTone: "mint" | "blue";
};

const MyAssetsPage: React.FC = () => {
  const navigate = useNavigate();

  const [allocation, setAllocation] = useState<AssetAllocationResponse | null>(null);
  const [cash, setCash] = useState<number | null>(null);

  // 자산 배분 데이터 조회
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
        // 실패 시 기본값 유지
        if (!alive) return;
        setAllocation(null);
        setCash(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // API 데이터 또는 기본값
  const stock = allocation?.stockAmount ?? 0;
  const changeRate = allocation?.changeRate ?? 0;
  const cashValue = cash ?? (allocation?.cashAmount ?? 0);
  const total = allocation?.totalAmount ?? (cashValue + stock);

  const [filter, setFilter] = useState<"전체" | "매수/매도" | "리워드">("전체");

  const txList = useMemo<TxItem[]>(
    () => [
      { title: "챌린지 리워드", type: "리워드", amountText: "+1,000 XP", amountTone: "mint" },
      { title: "챌린지 리워드", type: "매수", amountText: "₩720,000", amountTone: "blue" },
      { title: "챌린지 리워드", type: "리워드", amountText: "+500 XP", amountTone: "mint" },
    ],
    []
  );

  const filteredTx = useMemo(() => {
    if (filter === "전체") return txList;
    if (filter === "리워드") return txList.filter((t) => t.type === "리워드");
    // 매수/매도(현재는 매수만 더미)
    return txList.filter((t) => t.type === "매수");
  }, [filter, txList]);

  const stockRatio = stock / Math.max(1, cashValue + stock); // 0~1
  const cashRatio = 1 - stockRatio;
  const DONUT_R = 72;
  const DONUT_C = 2 * Math.PI * DONUT_R;
  const DONUT_GAP = 8; // 항상 유지되는 여백(원호 길이 기준)
  const hasGap = stockRatio > 0 && cashRatio > 0;
  // 2개 세그먼트(주식/현금) 경계는 2곳이라, 양쪽 모두 동일한 갭을 만들기 위해 GAP*2를 확보
  const donutAvailable = DONUT_C - (hasGap ? DONUT_GAP * 2 : 0);
  const stockLen = stockRatio * donutAvailable;
  const cashLen = cashRatio * donutAvailable;
  // 주식(시작) -> 갭 -> 현금 순서로 배치 (마지막에는 둘레 끝까지 갭이 남아 양쪽 갭이 동일해짐)
  const cashOffset = -(stockLen + (hasGap ? DONUT_GAP : 0));

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-60 py-5">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-8 py-5">
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
              자산 관리
            </button>
          </div>

          {/* 상단 2개 카드 */}
          <div className="w-full flex gap-[22px] items-center">
            {/* 총 자산 카드 */}
            <section className="bg-white border border-gray-300 rounded-lg w-[710px] h-[465px] px-10 py-8 flex flex-col gap-8">
              <div className="flex flex-col gap-10 w-full">
                <div className="flex items-center gap-5 w-full">
                  <div className="bg-etc-light-green rounded-xl h-11 p-2 flex items-center">
                    <ChangeRateIcon
                      className="w-6 h-[26px]"
                      color="#00A63E"
                      direction="up"
                      ariaLabel="총 자산"
                    />
                  </div>
                  <p className="text-Subtitle_L_Regular text-[#747474] w-64">총 자산</p>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <p className="text-Title_L_Medium text-black">{formatWon(total)}</p>
                  <p className={cn(
                    "text-Subtitle_S_Regular",
                    changeRate > 0 ? "text-etc-red" : changeRate < 0 ? "text-etc-blue" : "text-gray-400"
                  )}>
                    {changeRate > 0 ? "+" : ""}{changeRate}%
                  </p>
                </div>
              </div>

              <div className="w-full border-t border-gray-300" />

              <div className="w-full flex flex-col gap-[10px] items-end">
                <div className="w-full flex items-center justify-between">
                  <p className="text-Subtitle_M_Regular text-[#4C4C4C]">현금</p>
                  <p className="text-Title_L_Medium text-black w-32 text-right">
                    {cash === null ? "-" : formatWon(cash)}
                  </p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <p className="text-Subtitle_M_Regular text-[#4C4C4C]">주식</p>
                  <p className="text-Title_L_Medium text-black w-32 text-right">
                    {formatWon(stock)}
                  </p>
                </div>
              </div>
            </section>

            {/* 자산 배분 카드 */}
            <section className="bg-white border border-gray-300 rounded-lg w-[708px] h-[465px] px-10 py-8 flex flex-col gap-10 items-center">
              <div className="w-full flex items-center gap-5">
                <div className="bg-etc-light-blue rounded-xl h-11 p-2 flex items-center">
                  <BagIcon className="w-6 h-[26px] text-etc-blue" ariaLabel="자산 배분" />
                </div>
                <p className="text-Subtitle_L_Regular text-[#747474] w-64">자산 배분</p>
              </div>

              <div className="w-64 flex flex-col items-center gap-8">
                {/* 도넛 차트 (Figma 스타일 근접) */}
                <svg width="232" height="232" viewBox="0 0 232 232" aria-label="자산 배분 도넛 차트">
                  {/* 현금/주식 각각을 원호로 그림 + 둘 다 존재할 때만 여백(DONUT_GAP) 1개 유지 */}
                  {cashLen > 0 && (
                    <circle
                      cx="116"
                      cy="116"
                      r={DONUT_R}
                      stroke="#EAEBED"
                      strokeWidth="22"
                      fill="none"
                      strokeDasharray={`${cashLen} ${DONUT_C}`}
                      strokeDashoffset={cashOffset}
                      strokeLinecap="butt"
                      transform="rotate(-90 116 116)"
                    />
                  )}
                  {stockLen > 0 && (
                    <circle
                      cx="116"
                      cy="116"
                      r={DONUT_R}
                      stroke="#42D6BA"
                      strokeWidth="22"
                      fill="none"
                      strokeDasharray={`${stockLen} ${DONUT_C}`}
                      strokeDashoffset={0}
                      strokeLinecap="butt"
                      transform="rotate(-90 116 116)"
                    />
                  )}
                </svg>

                <div className="w-full flex items-center gap-5 justify-center">
                  <div className="flex items-center gap-2.5">
                    <div className="size-5 bg-main-1" />
                    <p className="text-Subtitle_M_Regular text-black">
                      주식 ({Math.round(stockRatio * 100)}%)
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="size-5 bg-[#EAEBED]" />
                    <p className="text-Subtitle_M_Regular text-black">
                      현금 ({Math.round(cashRatio * 100)}%)
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 거래 내역 */}
          <section className="bg-white border border-gray-300 rounded-lg w-full h-[491px] p-10 flex flex-col gap-10">
            <div className="w-full h-11 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="bg-etc-light-purple rounded-xl h-11 p-2 flex items-center">
                  <CalendarIcon className="text-[#7C3AED] bg-etc-light-purple" ariaLabel="거래 내역" />
                </div>
                <p className="text-Subtitle_L_Regular text-[#747474]">거래 내역</p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setFilter("전체")}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] leading-[17px] border",
                    filter === "전체"
                      ? "bg-main-1 border-main-1 text-white"
                      : "bg-white border-gray-300 text-[#4C4C4C]"
                  )}
                >
                  전체
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("매수/매도")}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] leading-[17px] border",
                    filter === "매수/매도"
                      ? "bg-main-1 border-main-1 text-white"
                      : "bg-white border-gray-300 text-[#4C4C4C]"
                  )}
                >
                  매수/매도
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("리워드")}
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] leading-[17px] border",
                    filter === "리워드"
                      ? "bg-main-1 border-main-1 text-white"
                      : "bg-white border-gray-300 text-[#4C4C4C]"
                  )}
                >
                  리워드
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col">
              {filteredTx.map((tx, idx) => (
                <div
                  key={`${tx.title}-${idx}`}
                  className={cn(
                    "w-full flex items-center justify-between py-10",
                    "border-b border-gray-300",
                    idx === filteredTx.length - 1 && "border-b"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <p className="text-Body_M_Regular text-black">{tx.title}</p>
                    <Chip
                      label={tx.type}
                      variant="secondary"
                      className={cn(
                        tx.type === "리워드"
                          ? "!border-main-1 !text-main-1 !bg-[#C7F3EB]"
                          : "!border-sub-blue !text-sub-blue !bg-[#A5B5D5]"
                      )}
                    />
                  </div>

                  <p
                    className={cn(
                      "text-Subtitle_L_Regular w-32 text-right",
                      tx.amountTone === "mint"
                        ? "text-main-1"
                        : "text-sub-blue"
                    )}
                  >
                    {tx.amountText}
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

export default MyAssetsPage;

