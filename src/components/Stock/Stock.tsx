import { cn } from "@/utils/cn";
import CloseIcon from "@/assets/svgs/CloseIcon";
import HeartIcon from "@/assets/svgs/HeartIcon";

export type StockType = "normal" | "trading" | "reserved" | "favorite";

export interface StockProps {
  /** 종목명 (첫 번째 줄) */
  stockName: string;
  /** 종목 설명 (두 번째 줄, 예: "바이오파마(ADR)") */
  stockDescription?: string;
  /** 현재 가격 */
  price: string;
  /** 변동 금액 (예: "+ ₩311" 또는 "- ₩50") */
  changeAmount: string;
  /** 변동률 (예: "59.03%" 또는 "-5.23%") */
  changePercent: string;
  /** 종목 타입 (normal: 일반, trading: 거래 종목, reserved: 예약 종목, favorite: 관심 종목) */
  type?: StockType;
  /** 이미지 URL (거래 종목, 예약 종목, 관심 종목일 때 표시) */
  imageUrl?: string;
  /** 이미지 alt 텍스트 */
  imageAlt?: string;
  /** X 아이콘 클릭 핸들러 (거래 종목 또는 예약 종목일 때 표시) */
  onClose?: () => void;
  /** 하트 아이콘 클릭 핸들러 (관심 종목일 때 표시) */
  onHeartClick?: () => void;
  /** 추가 스타일 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

export const Stock = ({
  stockName,
  stockDescription,
  price,
  changeAmount,
  changePercent,
  type = "normal",
  imageUrl,
  imageAlt,
  onClose,
  onHeartClick,
  className,
  onClick,
}: StockProps) => {
  // 변동 금액과 변동률의 부호는 항상 일치하므로 하나만 확인
  const isPositive = changePercent.startsWith("+");
  const changeColor = isPositive ? "text-etc-red" : "text-etc-blue";

  // 거래 종목, 예약 종목, 관심 종목일 때 추가 UI 표시
  const isSpecialType = type === "trading" || type === "reserved" || type === "favorite";
  const isFavorite = type === "favorite";

  return (
    <div
      className={cn(
        "flex gap-[10px] items-center w-full",
        isSpecialType && "border-b border-gray-300 border-solid py-2.5",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${stockName} ${stockDescription || ""} 종목: ${price}, ${changeAmount} ${changePercent}`}
    >
      {/* 왼쪽: 이미지 플레이스홀더 (거래 종목, 예약 종목, 관심 종목일 때) */}
      {isSpecialType && (
        <div className="relative shrink-0 w-[50px] h-[50px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || stockName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300" />
          )}
        </div>
      )}

      {/* 중앙: 종목 정보 */}
      <div className={cn("flex gap-[100px] items-center", isSpecialType ? "flex-1" : "w-full")}>
        {/* 왼쪽: 종목명 */}
        <div className="flex flex-col gap-[8px] items-start w-[132px] shrink-0">
          <p className="text-Subtitle_M_Medium text-black whitespace-pre-wrap w-full">
            {stockName}
          </p>
          {stockDescription && (
            <p className="text-Subtitle_M_Medium text-black whitespace-pre-wrap w-full">
              {stockDescription}
            </p>
          )}
        </div>

        {/* 오른쪽: 가격 정보 */}
        <div className="flex flex-col gap-[8px] items-end text-right w-[105px] shrink-0">
          <p className="text-Subtitle_M_Medium text-black whitespace-pre-wrap w-full">
            {price}
          </p>
          <p className={cn("text-Body_M_Regular whitespace-nowrap w-full", changeColor)}>
            {changeAmount} ({changePercent})
          </p>
        </div>
      </div>

      {/* 오른쪽: X 아이콘 또는 하트 아이콘 */}
      {isSpecialType && (
        <>
          {isFavorite ? (
            // 관심 종목: 하트 아이콘 (빨간색)
            <div
              className="w-6 h-6 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onHeartClick?.();
              }}
            >
            <HeartIcon
              className="h-full w-full"
              color="#FF0000"
              ariaLabel="관심 종목 해제"
            />
            </div>
          ) : (
            // 거래 종목 또는 예약 종목: X 아이콘
            <div
              className="h-[26px] w-6 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
            >
              <CloseIcon className="h-full w-full" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Stock;

