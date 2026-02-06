import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CandlestickData, Time } from "lightweight-charts";
import { StockListItem } from "@/components/StockListItem";
import StockChart, { generateMockCandleData, type ChartPeriod } from "./components/StockChart";
import OrderPanel from "./components/OrderPanel";
import BackIcon from "@/assets/svgs/BackIcon";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import { cn } from "@/utils/cn";
import { fetchCandles, fetchClosingPrices, type StockClosingPrice } from "@/api/market";
import { useMarketStore, useQuote } from "@/store/useMarketStore";

// Mock 호가 데이터
const MOCK_ASK_ORDERS = [
  { price: 71704, volume: "2.6K" },
  { price: 71604, volume: "5.8K" },
  { price: 71504, volume: "3.9K" },
];

const MOCK_BID_ORDERS = [
  { price: 71104, volume: "4.9K" },
  { price: 71004, volume: "4.4K" },
  { price: 70904, volume: "2.3K" },
  { price: 70804, volume: "5.9K" },
  { price: 70704, volume: "3.9K" },
];

const StockDetailPage = () => {
  const navigate = useNavigate();
  const { stockId } = useParams<{ stockId: string }>();
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("분봉");
  const [isFavorited, setIsFavorited] = useState(false);

  const [chartData, setChartData] = useState<CandlestickData<Time>[]>([]);
  const [, setIsLoading] = useState(false);
  const [stockInfo, setStockInfo] = useState<StockClosingPrice | null>(null);

  const { subscribe, unsubscribe } = useMarketStore();
  const stockIdNum = stockId ? Number(stockId) : 0;
  const quote = useQuote(stockIdNum);

  const chartPeriods: ChartPeriod[] = ["분봉", "일봉", "주봉", "월봉", "년봉"];

  // Subscribe to current stockId
  useEffect(() => {
    if (!stockIdNum) return;
    subscribe([stockIdNum]);
    return () => {
      unsubscribe([stockIdNum]);
    };
  }, [stockIdNum, subscribe, unsubscribe]);

  // Fetch stock info (초기 데이터)
  useEffect(() => {
    if (!stockId) return;
    const loadStockInfo = async () => {
      try {
        const [info] = await fetchClosingPrices([Number(stockId)]);
        if (info) {
          setStockInfo(info);
        }
      } catch (error) {
        console.error("Failed to fetch stock info:", error);
      }
    };
    loadStockInfo();
  }, [stockId]);

  // 실시간 데이터 또는 초기 데이터 사용
  const price = quote?.close ?? stockInfo?.close;
  const changePct = quote?.prevDayChangePct ?? stockInfo?.prevDayChangePct;
  const volume = quote?.volume ?? stockInfo?.volume;

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
    stockName: stockInfo?.stockName ?? "로딩 중...",
    stockCode: stockId || "종목 코드",
    tradingVolume: displayVolume,
    price: displayPrice,
    changeRate: displayChangeRate,
  };

  const loadCandles = useCallback(async () => {
    if (!stockId) return;
    setIsLoading(true);
    try {
      const data = await fetchCandles(stockId, chartPeriod);
      setChartData(data);
    } catch {
      // API 실패 시 mock 데이터로 폴백
      setChartData(generateMockCandleData(chartPeriod));
    } finally {
      setIsLoading(false);
    }
  }, [stockId, chartPeriod]);

  useEffect(() => {
    loadCandles();
  }, [loadCandles]);

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
            <StockListItem
              stockName={stockData.stockName}
              stockCode={stockData.stockCode}
              tradingVolume={stockData.tradingVolume}
              price={stockData.price}
              changeRate={stockData.changeRate}
              isFavorited={isFavorited}
              onFavoriteToggle={() => setIsFavorited(!isFavorited)}
            />
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
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <StockChart data={chartData} />
          </div>
        </section>

        {/* 오른쪽 패널 - 매수/매도 */}
        <aside className="w-[320px] shrink-0">
          <OrderPanel
            currentPrice={currentPrice}
            askOrders={MOCK_ASK_ORDERS}
            bidOrders={MOCK_BID_ORDERS}
          />
        </aside>
      </main>
    </div>
  );
};

export default StockDetailPage;
