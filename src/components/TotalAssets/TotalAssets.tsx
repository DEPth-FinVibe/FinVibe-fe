import React from "react";
import { cn } from "@/utils/cn";

export interface TotalAssetsProps {
  /** 총 자산 금액 */
  totalAmount?: number | null;
  /** 변화율 (퍼센트) */
  changeRate?: number | null;
  /** 추가 스타일 */
  className?: string;
}

/**
 * 총자산 표시 컴포넌트
 * 마이페이지에서 사용자의 총 자산과 변화율을 표시합니다.
 */
export const TotalAssets: React.FC<TotalAssetsProps> = ({
  totalAmount = null,
  changeRate = null,
  className,
}) => {
  // 금액 포맷팅 (천 단위 콤마)
  const formatAmount = (amount: number): string => {
    return `₩${amount.toLocaleString()}`;
  };

  // 변화율 포맷팅
  const formatChangeRate = (rate: number): string => {
    if (rate === 0) return "0%";
    const sign = rate > 0 ? "+" : "";
    return `${sign}${rate}%`;
  };

  const hasAmount = typeof totalAmount === "number" && Number.isFinite(totalAmount);
  const hasRate = typeof changeRate === "number" && Number.isFinite(changeRate);

  // 변화율에 따른 색상 결정 (0%는 회색)
  const changeRateColor =
    !hasRate || (changeRate as number) === 0
      ? "text-gray-400"
      : (changeRate as number) > 0
      ? "text-etc-red"
      : "text-etc-blue";

  return (
    <div
      className={cn(
        // 상단 요약 카드(320x152, padding 20/30, gap 20)와 동일 규격
        "bg-white border border-gray-300 rounded-lg w-full h-38 px-7.5 py-5 flex flex-col items-start gap-5",
        className
      )}
    >
      {/* 라벨 */}
      <p className="text-Subtitle_M_Regular text-main-1">총 자산</p>

      {/* 금액 및 변화율 */}
      <div className="flex flex-col gap-1">
        {/* 총 자산 금액 */}
        <p className="text-Title_L_Medium text-black">
          {hasAmount ? formatAmount(totalAmount as number) : "-"}
        </p>
        {/* 변화율 */}
        <p className={cn("text-Subtitle_S_Regular", changeRateColor)}>
          {hasRate ? formatChangeRate(changeRate as number) : "-"}
        </p>
      </div>
    </div>
  );
};

