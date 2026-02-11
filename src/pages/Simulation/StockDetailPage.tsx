import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { StockListItem } from "@/components/StockListItem";
import StockChart, { type ChartPeriod } from "./components/StockChart";
import OrderPanel from "./components/OrderPanel";
import BackIcon from "@/assets/svgs/BackIcon";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import { cn } from "@/utils/cn";
import { fetchCandles, fetchClosingPrices, toKstDateTime, type CandleWithVolume } from "@/api/market";
import { useMarketStore, useQuote } from "@/store/useMarketStore";
import { useMarketStatus } from "@/hooks/useMarketQueries";
import { memberApi } from "@/api/member";
import { useAuthStore } from "@/store/useAuthStore";

const StockDetailSkeleton = () => {
  return (
    <div className="flex gap-5 items-center px-[30px] py-5 rounded-lg border border-sub-gray animate-pulse">
      <div className="w-5 h-[19px] bg-gray-200 rounded" />
      <div className="flex flex-1 items-center justify-between min-w-0">
        <div className="flex flex-col gap-[15px] items-start shrink-0 w-[254px]">
          <div className="flex gap-4 items-center shrink-0 w-[254px]">
            <div className="h-5 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-14 bg-gray-100 rounded" />
          </div>
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex flex-col gap-[10px] items-end shrink-0 w-[155px]">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

function parseKstDateTime(dateTime: string): number {
  if (!dateTime) return NaN;

  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/.test(dateTime);
  const parsed = hasTimezone
    ? DateTime.fromISO(dateTime, { setZone: true })
    : DateTime.fromISO(dateTime, { zone: "Asia/Seoul" });

  if (!parsed.isValid) return NaN;
  return parsed.toMillis();
}

function parseKstDateTimeWithoutZone(dateTime: string): number {
  if (!dateTime) return NaN;

  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/.test(dateTime);
  const parsed = hasTimezone
    ? DateTime.fromISO(dateTime, { setZone: true })
    : DateTime.fromISO(dateTime, { zone: "Asia/Seoul" });

  if (!parsed.isValid) return NaN;
  return parsed.toMillis();
}

const StockDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { stockId } = useParams<{ stockId: string }>();
  const navigationState = location.state as { stockName?: string; stockCode?: string } | null;
  const user = useAuthStore((s) => s.user);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("분봉");
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stockId]);

  // 관심종목 여부 조회
  useEffect(() => {
    if (!user || !stockId) return;
    let cancelled = false;
    memberApi.getFavoriteStocks().then((list) => {
      if (!cancelled) {
        setIsFavorited(list.some((f) => f.stockId === Number(stockId)));
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [user, stockId]);

  const handleFavoriteToggle = async () => {
    if (!user || !stockId) return;
    const sid = Number(stockId);
    try {
      if (isFavorited) {
        await memberApi.removeFavoriteStock(sid);
        setIsFavorited(false);
      } else {
        await memberApi.addFavoriteStock(sid);
        setIsFavorited(true);
      }
    } catch {
      // 실패 시 무시
    }
  };

  const [chartData, setChartData] = useState<CandleWithVolume[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const allChartDataRef = useRef<CandleWithVolume[]>([]);

  const { subscribe, unsubscribe } = useMarketStore();
  const stockIdNum = stockId ? Number(stockId) : 0;
  const quote = useQuote(stockIdNum);
  const { isMarketOpen } = useMarketStatus();
  const [closingPrice, setClosingPrice] = useState<{
    close: number;
    prevDayChangePct: number;
    volume: number;
  } | null>(null);

  const chartPeriods: ChartPeriod[] = ["분봉", "일봉", "주봉", "월봉", "년봉"];

  // 장 열림 시에만 WebSocket 구독
  useEffect(() => {
    if (!stockIdNum || !isMarketOpen) return;
    subscribe([stockIdNum]);
    return () => {
      unsubscribe([stockIdNum]);
    };
  }, [stockIdNum, isMarketOpen, subscribe, unsubscribe]);

  // 장 열림: 실시간 WebSocket 데이터 사용
  useEffect(() => {
    if (!stockIdNum || isMarketOpen) {
      setClosingPrice(null);
      return;
    }

    let cancelled = false;
    fetchClosingPrices([stockIdNum])
      .then((prices) => {
        if (cancelled) return;
        const latest = prices[0];
        if (!latest) {
          setClosingPrice(null);
          return;
        }
        setClosingPrice({
          close: latest.close,
          prevDayChangePct: latest.prevDayChangePct,
          volume: latest.volume,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setClosingPrice(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [stockIdNum, isMarketOpen]);

  const basePriceData = isMarketOpen ? quote : closingPrice;
  const price = basePriceData?.close;
  const changePct = basePriceData?.prevDayChangePct;
  const volume = basePriceData?.volume;

  // 장중 분봉 차트는 WebSocket 현재가를 반영해 마지막 캔들을 실시간 업데이트
  useEffect(() => {
    if (!isMarketOpen || chartPeriod !== "분봉" || !quote || !Number.isFinite(quote.close) || quote.close <= 0) {
      return;
    }

    const quoteTime = parseKstDateTime(quote.at);
    if (!Number.isFinite(quoteTime)) return;

    const minuteTime = Math.floor(quoteTime / 60_000) * 60;

    setChartData((prev) => {
      if (prev.length === 0) {
        const initial = {
          time: minuteTime as CandleWithVolume["time"],
          open: quote.close,
          high: quote.close,
          low: quote.close,
          close: quote.close,
          volume: Number.isFinite(quote.volume) ? quote.volume : 0,
        } as CandleWithVolume;
        allChartDataRef.current = [initial];
        return [initial];
      }

      const next = [...prev];
      const last = next[next.length - 1];
      if (typeof last.time !== "number") {
        return prev;
      }

      if (last.time === minuteTime) {
        const updatedLast: CandleWithVolume = {
          ...last,
          high: Math.max(last.high, quote.close),
          low: Math.min(last.low, quote.close),
          close: quote.close,
          volume: Number.isFinite(quote.volume) ? Math.max(last.volume, quote.volume) : last.volume,
        };
        next[next.length - 1] = updatedLast;
      } else if (last.time < minuteTime) {
        const newCandle: CandleWithVolume = {
          time: minuteTime as CandleWithVolume["time"],
          open: last.close,
          high: Math.max(last.close, quote.close),
          low: Math.min(last.close, quote.close),
          close: quote.close,
          volume: Number.isFinite(quote.volume) ? quote.volume : 0,
        };
        next.push(newCandle);
      } else {
        return prev;
      }

      allChartDataRef.current = next;
      return next;
    });
  }, [quote, isMarketOpen, chartPeriod]);

  // Derive display values
  const displayPrice =
    price != null
      ? `₩${price.toLocaleString()}`
      : "₩실시간 가격";
  const displayChangeRate =
    changePct != null
      ? `${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%`
      : "+변화율";
  const displayVolume =
    volume != null ? volume.toLocaleString() : "";
  const currentPrice = price ?? 0;

  const stockData = {
    stockName: navigationState?.stockName ?? "로딩 중...",
    stockCode: navigationState?.stockCode ?? (stockId || "종목 코드"),
    tradingVolume: displayVolume,
    price: displayPrice,
    changeRate: displayChangeRate,
  };

  const loadCandles = useCallback(async () => {
    if (!stockId) return;
    setIsChartLoading(true);
    try {
      const data = await fetchCandles(stockId, chartPeriod);
      allChartDataRef.current = data;
      setChartData(data);
    } catch {
      allChartDataRef.current = [];
      setChartData([]);
    } finally {
      setIsChartLoading(false);
    }
  }, [stockId, chartPeriod]);

  useEffect(() => {
    loadCandles();
  }, [loadCandles]);

  // 스크롤 시 과거 데이터 추가 로딩
  const handleLoadMore = useCallback(async (endTime: string) => {
    if (!stockId) return;
    try {
      const startDate = new Date(parseKstDateTimeWithoutZone(endTime));
      // 기간별로 추가 로딩할 범위 결정
      switch (chartPeriod) {
        case "분봉": startDate.setDate(startDate.getDate() - 3); break;
        case "일봉": startDate.setMonth(startDate.getMonth() - 3); break;
        case "주봉": startDate.setFullYear(startDate.getFullYear() - 1); break;
        case "월봉": startDate.setFullYear(startDate.getFullYear() - 3); break;
        case "년봉": startDate.setFullYear(startDate.getFullYear() - 10); break;
      }
      const olderData = await fetchCandles(stockId, chartPeriod, {
        startTime: toKstDateTime(startDate),
        endTime: endTime,
      });
      if (olderData.length > 0) {
        const merged = [...olderData, ...allChartDataRef.current];
        // 중복 제거 (time 기준)
        const seen = new Set<string>();
        const unique = merged.filter((d) => {
          const key = String(d.time);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        allChartDataRef.current = unique;
        setChartData(unique);
      }
    } catch {
      // 추가 로딩 실패 시 무시
    }
  }, [stockId, chartPeriod]);

  const handleBack = () => {
    navigate("/simulation");
  };

  return (
    <div className="bg-white">
      <main className="flex px-32 py-6 gap-10">
        {/* 왼쪽 패널 - 차트 영역 */}
        <section className="flex-1 min-w-0 overflow-hidden">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition-colors"
          >
            <BackIcon className="w-6 h-6" />
          </button>

          {/* 주식 정보 카드 */}
          <div className="mb-6">
            {isMarketOpen || closingPrice ? (
              <StockListItem
                stockName={stockData.stockName}
                stockCode={stockData.stockCode}
                tradingVolume={stockData.tradingVolume}
                price={stockData.price}
                changeRate={stockData.changeRate}
                isFavorited={isFavorited}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ) : (
              <StockDetailSkeleton />
            )}
          </div>

          {/* 차트 기간 선택 탭 */}
          <div className="flex gap-2 mb-4">
            {chartPeriods.map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={cn(
                  "px-6 py-2 rounded-lg text-Body_M_Light transition-colors flex items-center gap-1",
                  chartPeriod === period
                    ? "bg-main-1 text-white"
                    : "bg-white text-black border border-gray-300"
                )}
              >
                {period}
                {period === "분봉" && (
                  <ChevronIcon className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>

          {/* 차트 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden relative">
            {isChartLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                <span className="text-gray-400 text-sm">차트 로딩중...</span>
              </div>
            )}
            {!isChartLoading && chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[500px] text-gray-400 text-sm">
                해당 기간의 차트 데이터가 없습니다.
              </div>
            ) : (
              <StockChart data={chartData} period={chartPeriod} onLoadMore={handleLoadMore} />
            )}
          </div>
        </section>

        {/* 오른쪽 패널 - 매수/매도 */}
        <aside className="w-[320px] shrink-0">
          <OrderPanel
            currentPrice={currentPrice}
            stockId={stockIdNum}
            stockName={navigationState?.stockName ?? `종목 ${stockIdNum}`}
            currency="KRW"
          />
        </aside>
      </main>
    </div>
  );
};

export default StockDetailPage;
