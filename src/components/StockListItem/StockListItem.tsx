import { cn } from "@/utils/cn";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import FavoriteStarIcon from "@/assets/svgs/FavoriteStarIcon";

// Tailwind etc 색상 값 (tailwind.config.js와 동일)
const COLORS = {
  "etc-red": "#FF0000",
  "etc-blue": "#001AFF",
} as const;

export interface StockListItemProps {
  /** 종목명 */
  stockName: string;
  /** 종목 코드 */
  stockCode: string;
  /** 거래량 */
  tradingVolume: string;
  /** 현재 가격 */
  price: string;
  /** 등락률 (예: "+2.23%" 또는 "-2.23%") */
  changeRate: string;
  /** 즐겨찾기 상태 */
  isFavorited?: boolean;
  /** 즐겨찾기 토글 핸들러 */
  onFavoriteToggle?: () => void;
  /** 추가 스타일 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

export const StockListItem = ({
  stockName,
  stockCode,
  tradingVolume,
  price,
  changeRate,
  isFavorited = false,
  onFavoriteToggle,
  className,
  onClick,
}: StockListItemProps) => {
  // 등락률의 부호 확인 (양수면 빨간색, 음수면 파란색)
  const isPositive = changeRate.startsWith("+");
  const changeColor = isPositive ? "text-etc-red" : "text-etc-blue";
  const iconColor = isPositive ? COLORS["etc-red"] : COLORS["etc-blue"];
  const iconDirection = isPositive ? "up" : "down";

  return (
    <div
      className={cn(
        "flex gap-5 items-center px-[30px] py-5 rounded-lg",
        isFavorited
          ? "bg-sub-blue"
          : "border border-sub-gray",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${stockName} (${stockCode}): ${price}, ${changeRate}`}
    >
      {/* 별 아이콘 */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteToggle?.();
        }}
      >
        <FavoriteStarIcon
          filled={isFavorited}
          className="w-5 h-[19px] shrink-0"
          ariaLabel={isFavorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-1 items-center justify-between min-w-0">
        {/* 왼쪽: 종목 정보 */}
        <div className="flex flex-col gap-[15px] items-start shrink-0 w-[254px]">
          {/* 종목명과 코드 */}
          <div className="flex gap-4 items-center shrink-0 w-[254px]">
            <p
              className={cn(
                "text-Subtitle_L_Medium shrink-0",
                isFavorited ? "text-white" : "text-sub-blue"
              )}
            >
              {stockName}
            </p>
            <p
              className={cn(
                "text-Caption_L_Light shrink-0",
                isFavorited ? "text-gray-100" : ""
              )}
              style={!isFavorited ? { color: "#747474" } : undefined}
            >
              {stockCode}
            </p>
          </div>
          {/* 거래량 */}
          <p
            className={cn(
              "text-Subtitle_S_Regular min-w-full shrink-0 w-min whitespace-pre-wrap",
              isFavorited ? "text-gray-100" : ""
            )}
            style={!isFavorited ? { color: "#747474" } : undefined}
          >
            거래량: {tradingVolume}
          </p>
        </div>

        {/* 오른쪽: 가격 및 등락률 */}
        <div className="flex flex-col gap-[10px] items-end shrink-0 w-[155px]">
          {/* 현재 가격 */}
          <p
            className={cn(
              "text-Subtitle_L_Medium min-w-full shrink-0 text-right w-min whitespace-pre-wrap",
              isFavorited ? "text-gray-100" : "text-black"
            )}
          >
            {price}
          </p>
          {/* 등락률 */}
          <div className="flex gap-[10px] items-center shrink-0">
            <ChangeRateIcon
              className="h-[26px] w-6 shrink-0"
              color={iconColor}
              direction={iconDirection}
              ariaLabel="등락률 아이콘"
            />
            <p
              className={cn(
                "text-Body_M_Light shrink-0 text-right w-12 whitespace-pre-wrap",
                changeColor
              )}
            >
              {changeRate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockListItem;

