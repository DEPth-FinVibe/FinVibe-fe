import React, { useState, useMemo, useEffect, memo } from "react";
import {
  TradingVolumeRank,
  TradingVolumeRankSkeleton,
  Chip
} from "@/components";
import { cn } from "@/utils/cn";
import { formatPrice, formatChangeRate, formatTradingValue } from "@/utils/formatStock";
import {
  useTopByValue,
  useTopByVolume,
  useTopRising,
  useTopFalling,
  useCategories,
  useCategoryStocks,
  useCategoryChangeRate,
  useAllCategoryChangeRates,
} from "@/hooks/useMarketQueries";
import type { StockWithPrice } from "@/api/market";
import { useMarketStore, useQuote } from "@/store/useMarketStore";
import { useMarketStatus } from "@/hooks/useMarketQueries";
import IndexHeaderItem from "./components/IndexHeaderItem";
import ThemeHeaderCard from "./components/ThemeHeaderCard";
import ThemeStockChart from "./components/ThemeStockChart";
import ThemeListDropdown from "./components/ThemeListDropdown";

const MOCK_FALLBACK = [
  { rank: 1, name: "엔비디아", ticker: "NVDA", price: "892,300원", change: "+3.21%", vol: "850억" },
  { rank: 2, name: "테슬라", ticker: "TSLA", price: "445,600원", change: "+5.67%", vol: "980억" },
  { rank: 3, name: "삼성전자", ticker: "005930", price: "74,200원", change: "+0.45%", vol: "720억" },
  { rank: 4, name: "LG에너지솔루션", ticker: "373220", price: "412,000원", change: "-1.45%", vol: "460억" },
  { rank: 5, name: "NAVER", ticker: "035420", price: "178,000원", change: "+1.23%", vol: "580억" },
  { rank: 6, name: "애플", ticker: "AAPL", price: "234,500원", change: "+2.34%", vol: "520억" },
  { rank: 7, name: "SK하이닉스", ticker: "000660", price: "186,500원", change: "+2.67%", vol: "650억" },
  { rank: 8, name: "마이크로소프트", ticker: "MSFT", price: "412,800원", change: "+1.45%", vol: "490억" },
  { rank: 9, name: "현대차", ticker: "005380", price: "234,500원", change: "+0.78%", vol: "430억" },
  { rank: 10, name: "카카오", ticker: "035720", price: "45,600원", change: "-0.34%", vol: "520억" },
];

type FilterType = "거래대금" | "거래량" | "급상승" | "급하락";

// 실시간 가격 업데이트를 위한 래퍼 컴포넌트
interface RealTimeStockRowProps {
  stock: StockWithPrice;
  rank: number;
  isSelected: boolean;
  onSelect: () => void;
}

const RealTimeStockRow = memo(({ stock, rank, isSelected, onSelect }: RealTimeStockRowProps) => {
  const quote = useQuote(stock.stockId);

  // 실시간 데이터가 있으면 사용, 없으면 REST API 데이터 사용
  const price = quote?.close ?? stock.close;
  const changePct = quote?.prevDayChangePct ?? stock.prevDayChangePct;
  const value = quote?.value ?? stock.value;

  return (
    <TradingVolumeRank
      rank={rank}
      stockName={stock.name}
      ticker={stock.symbol}
      currentPrice={formatPrice(price)}
      changeRate={formatChangeRate(changePct)}
      tradingVolume={formatTradingValue(value)}
      onClick={onSelect}
      className={`border-none ${isSelected ? "bg-gray-50" : ""}`}
    />
  );
});

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"popular" | "personal">("popular");
  const [activeFilter, setActiveFilter] = useState<FilterType>("거래대금");
  const [selectedStock, setSelectedStock] = useState({
    name: "엔비디아",
    ticker: "NVDA",
    price: "892,300원",
    change: "+3.21%",
  });

  // 테마 섹션 상태
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [showThemeList, setShowThemeList] = useState(false);

  // 좌측 리스트 쿼리
  const topByValue = useTopByValue();
  const topByVolume = useTopByVolume();
  const topRising = useTopRising();
  const topFalling = useTopFalling();

  const queryMap: Record<FilterType, typeof topByValue> = {
    "거래대금": topByValue,
    "거래량": topByVolume,
    "급상승": topRising,
    "급하락": topFalling,
  };

  const activeQuery = queryMap[activeFilter];
  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;
  const stockData = activeQuery.data;

  const { subscribe, unsubscribe } = useMarketStore();
  const { isMarketOpen } = useMarketStatus();

  // 장 열림 시에만 화면에 표시되는 종목들 웹소켓 구독
  useEffect(() => {
    if (!isMarketOpen || !stockData || stockData.length === 0) return;
    const stockIds = stockData.map((s) => s.stockId);
    subscribe(stockIds);
    return () => {
      unsubscribe(stockIds);
    };
  }, [stockData, isMarketOpen, subscribe, unsubscribe]);

  // 우측 테마 섹션 데이터
  const { data: categories } = useCategories();
  const categoryStocks = useCategoryStocks(selectedCategoryId);
  const categoryChangeRate = useCategoryChangeRate(selectedCategoryId);

  // 첫 카테고리 자동 선택
  useEffect(() => {
    if (categories && categories.length > 0 && selectedCategoryId == null) {
      setSelectedCategoryId(categories[0].categoryId);
    }
  }, [categories, selectedCategoryId]);

  // 카테고리 종목에서 거래대금 1위 추출
  const topByValueStock = useMemo(() => {
    if (!categoryStocks.data) return null;
    const { stocks, prices } = categoryStocks.data;
    if (prices.length === 0) return stocks[0] ?? null;
    const sorted = [...prices].sort((a, b) => b.value - a.value);
    const topPrice = sorted[0];
    if (!topPrice) return stocks[0] ?? null;
    const stock = stocks.find((s) => s.stockId === topPrice.stockId);
    return stock ?? null;
  }, [categoryStocks.data]);

  // 상위 3종목명
  const topStockNames = useMemo(() => {
    if (!categoryStocks.data) return [];
    return categoryStocks.data.stocks.slice(0, 3).map((s) => s.name);
  }, [categoryStocks.data]);

  // 드롭다운용 전체 카테고리 등락률
  const categoryIds = useMemo(
    () => (categories ?? []).map((c) => c.categoryId),
    [categories],
  );
  const allChangeRatesQueries = useAllCategoryChangeRates(
    showThemeList ? categoryIds : [],
  );
  const allChangeRates = useMemo(
    () => allChangeRatesQueries.map((q) => q.data),
    [allChangeRatesQueries],
  );

  return (
    <div className="bg-white font-noto">

      {/* 1. 종합 지수 섹션 (KOSPI + KOSDAQ) */}
      <section className="border-b border-gray-200">
        <div className="max-w-full gap-6 mx-auto px-8 py-6 flex items-center justify-center overflow-x-auto no-scrollbar">
          <IndexHeaderItem indexType="KOSPI" />
          <IndexHeaderItem indexType="KOSDAQ" />
        </div>
      </section>

      <main className="max-w-full mx-auto flex min-h-[calc(100vh-160px)]">
        {/* 2. 실시간 거래 대금 리스트 (좌측) */}
        <section className="w-[600px] border-r border-gray-200 flex flex-col shrink-0">
          <div className="flex flex-col gap-4 px-10 py-5">
            <h2 className="text-[20px] font-medium text-black">실시간 거래 대금</h2>

            {/* 탭 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("popular")}
                className={`px-4 py-2 rounded-[8px] text-[14px] transition-colors ${activeTab === "popular" ? "bg-[#42d6ba] text-white" : "bg-gray-100 text-gray-400"}`}
              >
                인기 종목
              </button>
              <button
                onClick={() => setActiveTab("personal")}
                className={`px-4 py-2 rounded-[8px] text-[14px] transition-colors ${activeTab === "personal" ? "bg-[#42d6ba] text-white" : "bg-gray-100 text-gray-400"}`}
              >
                개인 소유 TOP 10
              </button>
            </div>

            {/* 필터 버튼 */}
            <div className="flex gap-2">
              {(["거래대금", "거래량", "급상승", "급하락"] as FilterType[]).map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-3 py-1 rounded-full text-Caption_L_Light border transition-colors",
                    activeFilter === filter
                      ? "bg-sub-blue text-white border-sub-blue"
                      : "bg-white text-gray-400 border-gray-200"
                  )}
                />
              ))}
            </div>
          </div>

          {/* 종목 리스트 테이블 헤더 (TradingVolumeRank 너비에 맞춰 조정) */}
          <div className="flex border-y text-Body_M_Light border-gray-200 py-2 text-sm text-black">
            <span className="w-[87px] text-center">순위</span>
            <span className="w-[120px]">종목명</span>
            <span className="w-[62px] text-right">현재가</span>
            <span className="w-[120px] text-right px-5">등락률</span>
            <span className="w-[104px] text-right">거래대금</span>
            <span className="w-[78px] text-center">차트</span>
          </div>

          {/* 리스트 아이템 */}
          <div className="flex flex-col">
            {isLoading && (
              <>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TradingVolumeRankSkeleton key={i} className="border-none" />
                ))}
              </>
            )}
            {(isError || (!isLoading && (!stockData || stockData.length === 0))) &&
              MOCK_FALLBACK.map((stock) => (
                <TradingVolumeRank
                  key={stock.ticker}
                  rank={stock.rank}
                  stockName={stock.name}
                  ticker={stock.ticker}
                  currentPrice={stock.price}
                  changeRate={stock.change}
                  tradingVolume={stock.vol}
                  onClick={() => setSelectedStock({
                    name: stock.name,
                    ticker: stock.ticker,
                    price: stock.price,
                    change: stock.change
                  })}
                  className={`border-none ${selectedStock.ticker === stock.ticker ? "bg-gray-50" : ""}`}
                />
              ))
            }
            {!isLoading && !isError && stockData && stockData.length > 0 && stockData.map((stock: StockWithPrice, index: number) => (
              <RealTimeStockRow
                key={stock.stockId}
                stock={stock}
                rank={index + 1}
                isSelected={selectedStock.ticker === stock.symbol}
                onSelect={() => setSelectedStock({
                  name: stock.name,
                  ticker: stock.symbol,
                  price: formatPrice(stock.close),
                  change: formatChangeRate(stock.prevDayChangePct)
                })}
              />
            ))}
          </div>
        </section>

        {/* 3. 테마 섹션 (우측) */}
        <section className="flex-1 p-8 flex flex-col gap-8">
          {/* 테마 헤더 카드 */}
          <ThemeHeaderCard
            categoryName={categoryChangeRate.data?.categoryName ?? "테마 로딩중..."}
            changeRate={categoryChangeRate.data?.changeRate ?? 0}
            topStockNames={topStockNames}
            topByValueName={topByValueStock?.name ?? ""}
            showThemeList={showThemeList}
            onToggleThemeList={() => setShowThemeList((v) => !v)}
          />

          {/* 에어리어 차트 */}
          {topByValueStock && (
            <ThemeStockChart
              stockId={topByValueStock.stockId}
              stockName={topByValueStock.name}
            />
          )}

          {/* 테마 리스트 드롭다운 */}
          {showThemeList && categories && categories.length > 0 && (
            <ThemeListDropdown
              categories={categories}
              changeRates={allChangeRates}
              selectedCategoryId={selectedCategoryId!}
              onSelectCategory={(id) => {
                setSelectedCategoryId(id);
                setShowThemeList(false);
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
