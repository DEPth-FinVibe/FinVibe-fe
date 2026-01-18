import { cn } from "@/utils/cn";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import LineChartIcon from "@/assets/svgs/LineChartIcon";

// Tailwind etc 색상 값 (tailwind.config.js와 동일)
const COLORS = {
  "etc-red": "#FF0000",
  "etc-blue": "#001AFF",
} as const;

export interface TradingVolumeRankProps {
  /** 순위 */
  rank: number;
  /** 종목명 */
  stockName: string;
  /** 티커 (예: "TSLA") */
  ticker: string;
  /** 현재가 */
  currentPrice: string;
  /** 등락률 (예: "+5.67%" 또는 "-2.34%") */
  changeRate: string;
  /** 거래대금 (예: "980억") */
  tradingVolume: string;
  /** 차트 컴포넌트 또는 이미지 (지정하지 않으면 등락률에 따라 자동 생성) */
  chart?: React.ReactNode;
  /** 추가 스타일 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

export const TradingVolumeRank = ({
  rank,
  stockName,
  ticker,
  currentPrice,
  changeRate,
  tradingVolume,
  chart,
  className,
  onClick,
}: TradingVolumeRankProps) => {
  // 등락률의 부호 확인 (양수면 빨간색, 음수면 파란색)
  const isPositive = changeRate.startsWith("+");
  const changeColor = isPositive ? "text-etc-red" : "text-etc-blue";
  const iconColor = isPositive ? COLORS["etc-red"] : COLORS["etc-blue"];
  const iconDirection = isPositive ? "up" : "down";

  return (
    <div
      className={cn(
        "flex gap-[10px] items-start w-full py-[10px] border-b border-gray-300 border-solid",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${rank}위: ${stockName} (${ticker}) - ${currentPrice}, ${changeRate}, ${tradingVolume}`}
    >
      {/* 순위 */}
      <div className="flex flex-col h-[47px] items-center justify-center pl-[40px] shrink-0 w-[87px]">
        <p className="flex-1 text-Body_M_Light text-black w-full">
          {rank}
        </p>
      </div>

      {/* 종목명 */}
      <div className="flex flex-col items-start shrink-0 w-[120px]">
        <p className="text-Body_M_Light text-black w-full">
          {stockName}
        </p>
        {/* #747474 => 300으로 되어있어서 인라인 style로 */}
        <p className="text-Caption_M_Light w-full" style={{ color: "#747474" }}>
          {ticker}
        </p>
      </div>

      {/* 현재가 */}
      <div className="flex flex-col items-center justify-center shrink-0 w-[62px]">
        <p className="text-Body_M_Light text-black text-right w-full whitespace-nowrap">
          {currentPrice}
        </p>
      </div>

      {/* 등락률 */}
      <div className="flex gap-[4px] items-start pl-[45px] pr-[20px] shrink-0 w-[120px]">
        <ChangeRateIcon
          className="h-[26px] w-6 shrink-0"
          color={iconColor}
          direction={iconDirection}
          ariaLabel="등락률 차트"
        />
        <p className={cn("text-Body_M_Light text-right whitespace-nowrap", changeColor)}>
          {changeRate}
        </p>
      </div>

      {/* 거래대금 */}
      <div className="flex items-center justify-center pl-[36px] shrink-0 w-[104px]">
        <p className="text-Body_M_Light text-black text-right whitespace-nowrap">
          {tradingVolume}
        </p>
      </div>

      {/* 차트 */}
      <div className="h-[47px] shrink-0 w-[68px] py-[10px]">
        {chart || (
          <LineChartIcon
            color={iconColor}
            direction={iconDirection}
            className="w-full h-full"
            ariaLabel="거래대금 차트"
          />
        )}
      </div>
    </div>
  );
};

export default TradingVolumeRank;

