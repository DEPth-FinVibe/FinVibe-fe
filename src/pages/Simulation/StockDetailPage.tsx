import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StockListItem } from "@/components/StockListItem";
import StockChart, { generateMockCandleData, type ChartPeriod } from "./components/StockChart";
import OrderPanel from "./components/OrderPanel";
import BackIcon from "@/assets/svgs/BackIcon";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import { cn } from "@/utils/cn";

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
  const { stockCode } = useParams<{ stockCode: string }>();
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("분봉");
  const [isFavorited, setIsFavorited] = useState(false);

  const chartPeriods: ChartPeriod[] = ["분봉", "일봉", "주봉", "월봉", "년봉"];

  // Mock 주식 데이터 (실제로는 stockCode로 API 호출)
  const stockData = {
    stockName: "주식 종목 이름",
    stockCode: stockCode || "종목 코드",
    tradingVolume: "",
    price: "₩실시간 가격",
    changeRate: "+변화율",
    currentPrice: 71204,
  };

  const chartData = useMemo(() => generateMockCandleData(chartPeriod), [chartPeriod]);

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
            currentPrice={stockData.currentPrice}
            askOrders={MOCK_ASK_ORDERS}
            bidOrders={MOCK_BID_ORDERS}
          />
        </aside>
      </main>
    </div>
  );
};

export default StockDetailPage;
