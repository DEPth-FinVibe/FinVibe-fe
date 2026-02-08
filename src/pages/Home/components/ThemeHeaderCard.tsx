import LineChartIcon from "@/assets/svgs/LineChartIcon";

interface ThemeHeaderCardProps {
  categoryName: string;
  changeRate: number;
  topStockNames: string[];
  topByValueName: string;
  showThemeList: boolean;
  onToggleThemeList: () => void;
}

const ThemeHeaderCard = ({
  categoryName,
  changeRate,
  topStockNames,
  topByValueName,
  showThemeList,
  onToggleThemeList,
}: ThemeHeaderCardProps) => {
  const isPositive = changeRate >= 0;
  const rateStr = `${isPositive ? "+" : ""}${changeRate.toFixed(2)}%`;

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <div className="bg-[#42d6ba] p-2 rounded-lg">
          <LineChartIcon className="size-6 text-white" color="#FFFFFF" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-[18px] font-medium text-black">{categoryName}</h3>
            <span className={`text-[14px] ${isPositive ? "text-etc-red" : "text-etc-blue"}`}>
              {rateStr}
            </span>
          </div>
          <p className="text-[12px] text-gray-400">
            {topStockNames.length > 0 ? topStockNames.join(" · ") : ""}
          </p>
          {topByValueName && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              거래대금 1위: {topByValueName}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onToggleThemeList}
        className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded text-[12px] shrink-0"
      >
        테마 보기 {showThemeList ? "∧" : "∨"}
      </button>
    </div>
  );
};

export default ThemeHeaderCard;
