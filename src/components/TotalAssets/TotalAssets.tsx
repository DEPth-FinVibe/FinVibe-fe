import React from "react";
import { cn } from "@/utils/cn";

export interface TotalAssetsProps {
  /** 총 자산 금액 */
  totalAmount?: number;
  /** 변화율 (퍼센트) */
  changeRate?: number;
  /** 추가 스타일 */
  className?: string;
}

/**
 * 총자산 표시 컴포넌트
 * 마이페이지에서 사용자의 총 자산과 변화율을 표시합니다.
 */
export const TotalAssets: React.FC<TotalAssetsProps> = ({
  totalAmount = 10450000,
  changeRate = 4.5,
  className,
}) => {
  // 금액 포맷팅 (천 단위 콤마)
  const formatAmount = (amount: number): string => {
    return `₩${amount.toLocaleString()}`;
  };

  // 변화율 포맷팅
  const formatChangeRate = (rate: number): string => {
    const sign = rate >= 0 ? "+" : "";
    return `${sign}${rate}%`;
  };

  // 변화율에 따른 색상 결정
  const changeRateColor = changeRate >= 0 ? "text-etc-red" : "text-etc-blue";

  return (
    <div
      className={cn(
        "bg-white border border-gray-300 rounded-lg px-[30px] py-5 flex flex-col gap-5 w-full",
        className
      )}
    >
      {/* 라벨 */}
      <p className="text-Subtitle_M_Regular text-main-1">총 자산</p>

      {/* 금액 및 변화율 */}
      <div className="flex flex-col gap-1">
        {/* 총 자산 금액 */}
        <p className="text-Title_L_Medium text-black">
          {formatAmount(totalAmount)}
        </p>
        {/* 변화율 */}
        <p className={cn("text-Subtitle_S_Regular", changeRateColor)}>
          {formatChangeRate(changeRate)}
        </p>
      </div>
    </div>
  );
};

