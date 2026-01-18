import React, { useState } from "react";
import SearchIcon from "@/assets/svgs/SearchIcon";
import { cn } from "@/utils/cn";

interface StockStepProps {
  selectedStocks: string[];
  onToggleStock: (stock: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

const POPULAR_STOCKS = [
  "삼성전자", "SK 하이닉스", "NAVER", "카카오", "현대차", "LG에너지솔루션", "삼성바이오로직스", "기아"
];

const StockStep: React.FC<StockStepProps> = ({ selectedStocks, onToggleStock, onNext, onPrev }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-[30px] w-full font-noto">
      <div className="flex flex-col gap-[2px]">
        <div className="px-[122px] pt-[22px]">
          <label className="block text-[16px] font-normal text-black mb-[12px]">관심 있는 주식 종목 Top 3</label>
          <div className="relative">
            <span className="absolute left-[24px] top-1/2 -translate-y-1/2">
              <SearchIcon className="size-[24px] text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="종목명 검색.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#eaebed] border border-[#c7c7c9] rounded-[8px] pl-[60px] pr-[28px] py-[16px] text-[14px] font-light text-black placeholder:text-[#c7c7c9] focus:outline-none"
            />
          </div>
        </div>
        <div className="px-[122px] pt-[10px] pb-[4px]">
          <p className="text-[12px] font-light text-black">인기종목 :</p>
        </div>
        <div className="px-[122px] flex flex-wrap gap-[12px]">
          {POPULAR_STOCKS.map((stock) => (
            <button
              key={stock}
              type="button"
              onClick={() => onToggleStock(stock)}
              className={cn(
                "px-[14px] py-[6px] rounded-full border text-[12px] font-light transition-all",
                selectedStocks.includes(stock)
                  ? "bg-[#42d6ba] border-[#42d6ba] text-white"
                  : "bg-white border-[#eaebed] text-gray-500 hover:border-[#42d6ba] hover:text-[#42d6ba]"
              )}
            >
              {stock}
            </button>
          ))}
        </div>
      </div>
      <div className="px-[122px] flex gap-[30px] py-[10px]">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 bg-white border border-[#909193] py-[10px] text-[#909193] text-[16px] font-light rounded-[4px] hover:bg-gray-50 transition-colors"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={selectedStocks.length === 0}
          className="flex-1 bg-[#42d6ba] py-[10px] text-white text-[16px] font-light rounded-[4px] disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-[20px]"
        >
          <span>다음</span>
          <span>&gt;</span>
        </button>
      </div>
    </div>
  );
};

export default StockStep;

