import React from "react";
import { cn } from "@/utils/cn";
import Chip from "@/components/Chip/Chip";
import ChallengeCompletedIcon from "@/assets/svgs/ChallengeCompletedIcon";
import { BADGE_CONFIG, type BadgeType } from "@/components/Badge/badgeConfig";

export interface CompletedChallengeItemProps {
  /** 챌린지 제목 또는 배지명 */
  title: string;
  /** 완료 날짜 (YYYY.MM.DD 형식) */
  completedDate: string;
  /** 종목명 (칩에 표시) */
  stockName?: string;
  /** 항목 타입: 챌린지 완료 또는 배지 획득 */
  type: "challenge" | "badge";
  /** 배지 코드 (배지 타입일 때만 사용) */
  badgeCode?: string;
  /** 추가 스타일 */
  className?: string;
}

export const CompletedChallengeItem = ({
  title,
  completedDate,
  stockName,
  type,
  badgeCode,
  className,
}: CompletedChallengeItemProps) => {
  // 아이콘 렌더링
  const renderIcon = () => {
    if (type === "challenge") {
      // 챌린지 완료: 체크 아이콘
      return (
        <div className="h-[45px] w-[47px] shrink-0">
          <ChallengeCompletedIcon className="w-full h-full" />
        </div>
      );
    }
    
    // 배지 획득: 배지 코드에 맞는 아이콘 사용 (원 안에 들어가도록)
    if (badgeCode && badgeCode in BADGE_CONFIG) {
      const badgeType = badgeCode as BadgeType;
      const config = BADGE_CONFIG[badgeType];
      
      // 작은 크기 아이콘 렌더링 (달성 완료 섹션용)
      const renderSmallIcon = () => {
        const iconElement = config.icon(true);
        if (React.isValidElement(iconElement)) {
          return React.cloneElement(iconElement as React.ReactElement<any>, {
            className: "w-[19px] h-[19px]",
          });
        }
        return iconElement;
      };
      
      return (
        <div className="relative shrink-0 size-[45px]">
          <div className="w-full h-full border-2 border-gray-300 rounded-full flex items-center justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {renderSmallIcon()}
            </div>
          </div>
        </div>
      );
    }
    
    // 배지 코드가 없거나 유효하지 않은 경우 기본 아이콘
    return (
      <div className="grid grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        <div className="col-1 ml-[6.75px] mt-[6.75px] overflow-clip relative row-1 size-[31.5px]">
          <div className="absolute h-[29.008px] left-[6.25px] top-[0.25px] w-[19px]">
            <div className="w-full h-full bg-etc-light-yellow rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded" />
            </div>
          </div>
        </div>
        <div className="col-1 ml-0 mt-0 relative row-1 size-[45px]">
          <div className="w-full h-full border-2 border-gray-300 rounded-full bg-etc-light-yellow" />
        </div>
      </div>
    );
  };

  return (
    <article
      className={cn(
        "flex items-center justify-between p-5 bg-white border border-gray-300 border-solid rounded relative w-full gap-5",
        className
      )}
      role="article"
      aria-label={type === "challenge" ? `완료된 챌린지: ${title}` : `획득한 배지: ${title}`}
    >
      {/* 아이콘 */}
      {renderIcon()}

      {/* 내용 */}
      <div className="flex flex-col gap-[10px] items-start relative shrink-0 flex-1 min-w-0">
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
            <div className="flex gap-[1013px] items-center relative shrink-0 w-full">
              <div className="flex gap-6 items-start relative shrink-0">
                <h3 className="text-Subtitle_L_Regular text-black whitespace-pre-wrap">
                  {title}
                </h3>
              </div>
            </div>
            <p className="text-Body_L_Light text-black w-full whitespace-pre-wrap">
              {completedDate}
            </p>
          </div>
        </div>
      </div>

      {/* 종목명 칩 */}
      {stockName && (
        <Chip label={stockName} variant="secondary" />
      )}
    </article>
  );
};

