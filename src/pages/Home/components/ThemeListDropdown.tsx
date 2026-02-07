import { useState, useMemo } from "react";
import { Chip } from "@/components";
import { cn } from "@/utils/cn";
import type { CategoryResponse, CategoryChangeRateResponse } from "@/api/market";
import LineChartIcon from "@/assets/svgs/LineChartIcon";

type ThemeFilter = "전체" | "산업 테마" | "투자 스타일";

interface ThemeListDropdownProps {
  categories: CategoryResponse[];
  changeRates: (CategoryChangeRateResponse | undefined)[];
  selectedCategoryId: number;
  onSelectCategory: (id: number) => void;
}

const ThemeListDropdown = ({
  categories,
  changeRates,
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

      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
        {sorted.map((cat, idx) => {
          const rate = rateMap.get(cat.categoryId) ?? 0;
          const isPositive = rate >= 0;
          const isSelected = cat.categoryId === selectedCategoryId;

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
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[13px] font-medium text-black truncate">
                  {cat.name}
                </span>
                <span
                  className={cn(
                    "text-[12px]",
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
