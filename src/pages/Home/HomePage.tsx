import React, { useState } from "react";
import {
  StockChartHeader,
  TradingVolumeRank,
  RelatedNews,
  Chip
} from "@/components";
import { cn } from "@/utils/cn";
import LineChartIcon from "@/assets/svgs/LineChartIcon";

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"popular" | "personal">("popular");
  const [activeFilter, setActiveFilter] = useState("거래대금");
  const [selectedStock, setSelectedStock] = useState({
    name: "엔비디아",
    ticker: "NVDA",
    price: "892,300원",
    change: "+3.21%",
    theme: "K-방산 테마",
    themeChange: "+4.12%",
    description: "한화에어로스페이스 · LIG넥스원 · 현대로템"
  });
  
  return (
    <div className="bg-white font-noto">
      
      {/* 1. 종합 지수 섹션 (Figma 646:3379 기반 6개 지수) */}
      <section className="border-b border-gray-200">
        <div className="max-w-full gap-6 mx-auto px-8 py-6 flex items-center justify-between overflow-x-auto no-scrollbar">
          <StockChartHeader 
            indexName="코스피종합" 
            currentValue="2,500.25" 
            changeAmount="+6.61" 
            changeRate="+0.24%" 
            className="flex justify-center items-center"
          />
          <StockChartHeader 
            indexName="코스닥" 
            currentValue="709.52" 
            changeAmount="-8.82" 
            changeRate="-1.23%"
            className="flex justify-center items-center"
          />
          <StockChartHeader 
            indexName="다우지수" 
            currentValue="43,375.99" 
            changeAmount="-504.91" 
            changeRate="-1.15%" 
            className="flex justify-center items-center"
          />
          <StockChartHeader 
            indexName="나스닥" 
            currentValue="18,792.28" 
            changeAmount="-1859.66" 
            changeRate="-0.29%" 
          />
          <StockChartHeader 
            indexName="S&P 500" 
            currentValue="5,999.80" 
            changeAmount="-17.52" 
            changeRate="-5.22%" 
          />
          <StockChartHeader 
            indexName="달러-원" 
            currentValue="1385.63" 
            changeAmount="-8.67" 
            changeRate="-0.62%" 
          />
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
              {["거래대금", "거래량", "급상승", "급하락"].map((filter) => (
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

          {/* 리스트 아이템 (디자인 이미지 기반 데이터) */}
          <div className="flex flex-col">
            {[
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
            ].map((stock) => (
              <TradingVolumeRank 
                key={stock.ticker}
                rank={stock.rank}
                stockName={stock.name}
                ticker={stock.ticker}
                currentPrice={stock.price}
                changeRate={stock.change}
                tradingVolume={stock.vol}
                onClick={() => setSelectedStock({
                  ...selectedStock,
                  name: stock.name,
                  ticker: stock.ticker,
                  price: stock.price,
                  change: stock.change
                })}
                className={`border-none ${selectedStock.ticker === stock.ticker ? "bg-gray-50" : ""}`}
              />
            ))}
          </div>
        </section>

        {/* 3. 차트 및 상세 분석 (우측) */}
        <section className="flex-1 p-8 flex flex-col gap-10">
          {/* 상단 차트 헤더 */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-[#42d6ba] p-2 rounded-lg">
                  <LineChartIcon className="size-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-[18px] font-medium text-black">{selectedStock.theme}</h3>
                    <span className="text-[#42d6ba] text-[14px]">{selectedStock.themeChange}</span>
                  </div>
                  <p className="text-[12px] text-gray-400">{selectedStock.description}</p>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded text-[12px]">테마 보기</button>
            </div>

            {/* 대형 캔들 차트 이미지 플레이스홀더 (이미지 디자인 반영) */}
            <div className="w-full aspect-[2.5/1] bg-white border-y border-gray-200 relative flex items-center justify-center overflow-hidden py-10">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              </div>
              {/* 차트 가로선 */}
              <div className="absolute inset-0 flex flex-col justify-between py-12 pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-[1px] bg-gray-100"></div>
                ))}
              </div>
              {/* 차트 막대 (이미지 시각적 재현 - 캔들 형태) */}
              <div className="relative z-10 flex items-center justify-between px-6 w-full h-[70%]">
                {Array.from({ length: 40 }).map((_, i) => {
                  const isRed = i % 5 !== 2;
                  const height = 30 + Math.random() * 60;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-1 max-w-[8px] h-full relative"
                    >
                      {/* 캔들 심지 */}
                      <div
                        className={cn(
                          "w-[1px] absolute top-1/2 -translate-y-1/2",
                          isRed ? "bg-red-200" : "bg-blue-200"
                        )}
                        style={{ height: `${height + 10}%` }}
                      ></div>
                      {/* 캔들 몸통 */}
                      <div
                        className={cn(
                          "w-full rounded-sm absolute top-1/2 -translate-y-1/2 z-20",
                          isRed ? "bg-red-500" : "bg-blue-500"
                        )}
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
              {/* 하단 시간 축 */}
              <div className="absolute bottom-2 left-0 w-full flex justify-between px-6 text-[10px] text-gray-400">
                <span>09:00</span>
                <span>10:00</span>
                <span>11:00</span>
                <span>12:00</span>
                <span>13:00</span>
                <span>14:00</span>
                <span>15:00</span>
              </div>
            </div>
          </div>

          {/* AI 분석 섹션 */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <div className="bg-[#42d6ba] size-[50px] flex justify-center items-center p-4 rounded-lg shrink-0">
                <span className="text-white text-[20px] font-medium text-Body_M_Regular">AI</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[14px] text-gray-400">오늘의 테마 분석</span>
                <p className="text-[16px] font-medium text-black">폴란드 추가 수출 계약 체결 소식. 중동 지역 방산 협력 논의 진행 중</p>
              </div>
            </div>
          </div>

          {/* 관련 뉴스 섹션 */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[18px] font-bold text-black">관련뉴스</h3>
            <div className="flex flex-col gap-3">
              <RelatedNews 
                sourceAndTime="매일경제 · 2시간 전" 
                title="엔비디아 신규 AI 칩 공개... 국내 반도체 수혜 전망"
                className="border-gray-200 text-black hover:border-[#42d6ba] transition-colors"
              />
              <RelatedNews 
                sourceAndTime="한국경제 · 4시간 전" 
                title="SK하이닉스, HBM3E 양산 본격화... 실적 개선 기대"
                className="border-gray-200 text-black hover:border-[#42d6ba] transition-colors"
              />
              <RelatedNews 
                sourceAndTime="서울경제 · 6시간 전" 
                title="글로벌 AI 반도체 시장 내년 50% 성장 전망"
                className="border-gray-200 text-black hover:border-[#42d6ba] transition-colors"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
