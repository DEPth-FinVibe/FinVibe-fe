import { useState, useMemo } from "react";
import { Chip } from "@/components";
import { cn } from "@/utils/cn";
import type { CategoryResponse, CategoryChangeRateResponse } from "@/api/market";
import LineChartIcon from "@/assets/svgs/LineChartIcon";

const THEME_NAME_COLORS = [
  "#6C5CE7", // 보라
  "#E17055", // 코랄
  "#0984E3", // 파랑
  "#F39C12", // 오렌지
  "#E84393", // 핑크
  "#00B894", // 민트
  "#D63031", // 레드
  "#2D98DA", // 스카이블루
  "#8854D0", // 진보라
  "#20BF6B", // 초록
  "#FA8231", // 주황
  "#3867D6", // 남색
];

function getThemeColor(categoryId: number): string {
  return THEME_NAME_COLORS[categoryId % THEME_NAME_COLORS.length];
}

type ThemeFilter = "전체" | "산업 테마" | "투자 스타일";

interface ThemeListDropdownProps {
  categories: CategoryResponse[];
  changeRates: (CategoryChangeRateResponse | undefined)[];
  topStockByCategory: Map<number, string>;
  selectedCategoryId: number;
  onSelectCategory: (id: number) => void;
}

const ThemeListDropdown = ({
  categories,
  changeRates,
  topStockByCategory,
  selectedCategoryId,
  onSelectCategory,
}: ThemeListDropdownProps) => {
  const [filter, setFilter] = useState<ThemeFilter>("전체");

  const rateMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const cr of changeRates) {
      if (cr) map.set(cr.categoryId, cr.changeRate);
    }
    return map;
  }, [changeRates]);

  const sorted = useMemo(() => {
    return [...categories].sort((a, b) => {
      const rateA = rateMap.get(a.categoryId) ?? 0;
      const rateB = rateMap.get(b.categoryId) ?? 0;
      return rateB - rateA;
    });
  }, [categories, rateMap]);

  const filters: ThemeFilter[] = ["전체", "산업 테마", "투자 스타일"];

  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex gap-2">
        {filters.map((f) => (
          <Chip
            key={f}
            label={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1 rounded-full text-Caption_L_Light border transition-colors",
              filter === f
                ? "bg-sub-blue text-white border-sub-blue"
                : "bg-white text-gray-400 border-gray-200"
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 h-[250px] overflow-y-auto">
        {sorted.map((cat, idx) => {
          const rate = rateMap.get(cat.categoryId) ?? 0;
          const isPositive = rate >= 0;
          const isSelected = cat.categoryId === selectedCategoryId;
          const topStock = topStockByCategory.get(cat.categoryId);

          return (
            <button
              key={cat.categoryId}
              onClick={() => onSelectCategory(cat.categoryId)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg text-left transition-colors border",
                isSelected
                  ? "border-[#42d6ba] bg-[#E8FAF6]"
                  : "border-gray-100 hover:border-gray-300",
                idx % 2 === 0 && !isSelected && "bg-[#C7F3EB]/30"
              )}
            >
              <div className="bg-[#42d6ba]/20 p-1.5 rounded shrink-0">
                <LineChartIcon
                  className="size-4"
                  color={isPositive ? "#FF0000" : "#001AFF"}
                  direction={isPositive ? "up" : "down"}
                />
              </div>
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className="text-[13px] font-medium truncate"
                    style={{ color: getThemeColor(cat.categoryId) }}
                  >
                    {cat.categoryName}
                  </span>
                  {topStock && (
                    <span className="text-[11px] text-gray-400 truncate">
                      {topStock}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[12px] font-medium shrink-0 ml-2",
                    isPositive ? "text-etc-red" : "text-etc-blue"
                  )}
                >
                  {isPositive ? "+" : ""}{rate.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeListDropdown;
