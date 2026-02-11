import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "@/components";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import BagIcon from "@/assets/svgs/BagIcon";
import CalendarIcon from "@/assets/svgs/CalendarIcon";
import { cn } from "@/utils/cn";
import { walletApi } from "@/api/wallet";
import { assetPortfolioApi, type AssetAllocationResponse } from "@/api/asset";
import { tradeApi } from "@/api/trade";
import { studyApi } from "@/api/study";
import { gamificationApi } from "@/api/gamification";

const formatWon = (value: number) => `₩${value.toLocaleString()}`;

type TxType = "리워드" | "매수" | "매도";

type TxItem = {
  id: string;
  title: string;
  type: TxType;
  amountText: string;
  amountTone: "mint" | "blue";
  timestamp: string;
};

const MyAssetsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  const [txList, setTxList] = useState<TxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  // 거래 내역 및 리워드 통합 조회
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const monthStr = `${year}-${String(month).padStart(2, "0")}`;

        const [tradesResult, lessonsResult, challengesResult, coursesResult] =
          await Promise.allSettled([
            tradeApi.getTradeHistory(year, month),
            studyApi.getMonthlyLessonCompletions(monthStr),
            gamificationApi.getCompletedChallenges(
              String(year),
              String(month).padStart(2, "0"),
            ),
            studyApi.getMyCourses(),
          ]);

        if (!alive) return;

        const transactions: TxItem[] = [];

        // 거래 내역 (매수/매도)
        if (tradesResult.status === "fulfilled") {
          for (const trade of tradesResult.value) {
            const action = trade.transactionType === "BUY" ? "매수" : "매도";
            const totalAmount = trade.amount * trade.price;
            transactions.push({
              id: `trade-${trade.tradeId}`,
              title: `${trade.stockName ?? "종목"} ${action}`,
              type: trade.transactionType === "BUY" ? "매수" : "매도",
              amountText: formatWon(totalAmount),
              amountTone: "blue",
              timestamp: trade.createdAt,
            });
          }
        }

        // 학습 완료 리워드
        if (lessonsResult.status === "fulfilled" && coursesResult.status === "fulfilled") {
          const lessonTitleMap = new Map<number, string>();
          for (const course of coursesResult.value) {
            for (const lesson of course.lessons) {
              lessonTitleMap.set(lesson.id, lesson.title);
            }
          }

          // 레슨 완료 시 XP는 일반적으로 500 XP
          // 현재 레슨 완료 API 응답에 XP가 포함되어 있지 않으므로 기본값 사용
          // 실제 API 응답에 XP가 포함되어 있으면 수정 필요
          const DEFAULT_LESSON_XP = 500;

          for (const item of lessonsResult.value.items) {
            const lessonTitle = lessonTitleMap.get(item.lessonId);
            
            // 레슨 완료 시 XP는 일반적으로 500 XP
            // 실제 API 응답에 XP가 포함되어 있으면 수정 필요
            const xpAmount = DEFAULT_LESSON_XP;

            transactions.push({
              id: `study-${item.lessonId}-${item.completedAt}`,
              title: lessonTitle ? `${lessonTitle}` : "학습 완료 리워드",
              type: "리워드",
              amountText: `+${xpAmount.toLocaleString()} XP`,
              amountTone: "mint",
              timestamp: item.completedAt,
            });
          }
        }

        // 챌린지 완료 리워드
        if (challengesResult.status === "fulfilled") {
          for (const challenge of challengesResult.value) {
            transactions.push({
              id: `challenge-${challenge.challengeId}`,
              title: "챌린지 리워드",
              type: "리워드",
              amountText: `+${challenge.rewardXp.toLocaleString()} XP`,
              amountTone: "mint",
              timestamp: challenge.completedAt,
            });
          }
        }

        // 최신순 정렬
        transactions.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );

        setTxList(transactions);
      } catch (error) {
        console.error("거래 내역 조회 실패:", error);
        setTxList([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filteredTx = useMemo(() => {
    let filtered: TxItem[] = [];
    if (filter === "전체") filtered = txList;
    else if (filter === "리워드") filtered = txList.filter((t) => t.type === "리워드");
    else filtered = txList.filter((t) => t.type === "매수" || t.type === "매도");
    
    return filtered;
  }, [filter, txList]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredTx.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTx = filteredTx.slice(startIndex, endIndex);

  // 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

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
          <section className="bg-white border border-gray-300 rounded-lg w-full min-h-[491px] p-10 flex flex-col gap-10">
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
              {loading ? (
                <div className="w-full py-10 text-center text-Subtitle_L_Regular text-gray-400">
                  불러오는 중...
                </div>
              ) : filteredTx.length === 0 ? (
                <div className="w-full py-10 text-center text-Subtitle_L_Regular text-gray-400">
                  거래 내역이 없습니다
                </div>
              ) : (
                <>
                  <div className="w-full">
                    {paginatedTx.map((tx, idx) => (
                      <div
                        key={tx.id}
                        className={cn(
                          "w-full flex items-center justify-between py-10",
                          "border-b border-gray-300",
                          idx === paginatedTx.length - 1 && "border-b-0"
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

                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                    <div className="w-full flex items-center justify-center gap-[10px] pt-5 border-t border-gray-300">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage <= 1}
                        className={cn(
                          "size-[40px] flex items-center justify-center",
                          currentPage <= 1 ? "text-gray-300 cursor-not-allowed" : "text-black"
                        )}
                        aria-label="이전 페이지"
                      >
                        <span className="text-[24px] leading-[1.25]">&lt;</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "size-[40px] flex items-center justify-center",
                            "text-[24px] leading-[1.25] font-medium",
                            currentPage === page
                              ? "bg-main-1 text-white rounded-[4px]"
                              : "text-black"
                          )}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage >= totalPages}
                        className={cn(
                          "size-[40px] flex items-center justify-center",
                          currentPage >= totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-black"
                        )}
                        aria-label="다음 페이지"
                      >
                        <span className="text-[24px] leading-[1.25]">&gt;</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyAssetsPage;

