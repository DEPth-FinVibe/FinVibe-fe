import { cn } from "@/utils/cn";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import StockChartLineIcon from "@/assets/svgs/StockChartLineIcon";

// Tailwind etc 색상 값 (tailwind.config.js와 동일)
const COLORS = {
  "etc-red": "#FF0000",
  "etc-blue": "#001AFF",
} as const;

export interface StockChartHeaderProps {
  /** 지수명 (예: "코스닥", "코스피") */
  indexName: string;
  /** 현재 지수 값 */
  currentValue: string;
  /** 등락액 (예: "+106.47" 또는 "-106.47") */
  changeAmount: string;
  /** 등락률 (예: "+4.27%" 또는 "-4.27%") */
  changeRate: string;
  /** 추가 스타일 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

export const StockChartHeader = ({
  indexName,
  currentValue,
  changeAmount,
  changeRate,
  className,
  onClick,
}: StockChartHeaderProps) => {
  // 등락률의 부호 확인 (양수면 빨간색, 음수면 파란색)
  const isPositive = changeRate.startsWith("+");
  const changeColor = isPositive ? "text-etc-red" : "text-etc-blue";
  const iconColor = isPositive ? COLORS["etc-red"] : COLORS["etc-blue"];
  const iconDirection = isPositive ? "up" : "down";

  return (
    <div
      className={cn(
        "flex items-center w-full",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${indexName}: ${currentValue}, ${changeAmount}, ${changeRate}`}
    >
      {/* 차트 라인 */}
      <div className="flex flex-col h-[71px] pb-[10px] pt-[4px] px-[10px] shrink-0 w-[78px]">
        <StockChartLineIcon
          color={iconColor}
          direction={iconDirection}
          className="w-[58px] h-[33px]"
          ariaLabel="지수 차트"
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col gap-[4px] items-start shrink-0 w-[130px]">
        {/* 지수명 */}
        <p className="text-Body_M_Regular w-full" style={{ color: "#747474" }}>
          {indexName}
        </p>

        {/* 현재 값 */}
        <p className="text-Subtitle_S_Regular text-black w-full">
          {currentValue}
        </p>

        {/* 등락 정보 */}
        <div className="flex gap-[4px] items-center">
          <ChangeRateIcon
            className="h-2 w-4 shrink-0 mx-1 my-2"
            color={iconColor}
            direction={iconDirection}
            ariaLabel="등락률 아이콘"
          />
          <p className={cn("text-Caption_M_Light whitespace-nowrap", changeColor)}>
            {changeAmount}
          </p>
          <p className={cn("text-Caption_M_Light whitespace-nowrap", changeColor)}>
            {changeRate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockChartHeader;

