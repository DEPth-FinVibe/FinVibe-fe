import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/utils/cn";
import CloseIcon from "@/assets/svgs/CloseIcon";
import SearchIcon from "@/assets/svgs/SearchIcon";
import type { SquadRankingItem, SquadContributionItem } from "@/api/gamification";
import { getRankMedal } from "@/components/SquadRanking/SquadRanking";

type SquadRankingModalVariant = "university" | "contribution";

export interface SquadRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: SquadRankingModalVariant;
  squadRankingItems?: SquadRankingItem[];
  mySquadId?: number | null;
  contributionItems?: SquadContributionItem[];
  myNickname?: string;
}

const VARIANT_CONFIG = {
  university: {
    title: "대학 랭킹",
    searchPlaceholder: "학교명 검색",
    scrollButtonLabel: "내 학교로 이동",
  },
  contribution: {
    title: "기여도 랭킹",
    searchPlaceholder: "닉네임 검색",
    scrollButtonLabel: "내 순위로 이동",
  },
} as const;

export const SquadRankingModal: React.FC<SquadRankingModalProps> = ({
  isOpen,
  onClose,
  variant,
  squadRankingItems = [],
  mySquadId,
  contributionItems = [],
  myNickname,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const myItemRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const config = VARIANT_CONFIG[variant];

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 모달 닫힐 때 검색어 초기화
  useEffect(() => {
    if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  const handleScrollToMe = useCallback(() => {
    myItemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  if (!isOpen) return null;

  // 대학 랭킹 variant
  if (variant === "university") {
    const sorted = [...squadRankingItems].sort(
      (a, b) => a.currentRanking - b.currentRanking
    );
    const filtered = searchQuery
      ? sorted.filter((item) =>
          item.squadName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : sorted;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.43)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)] w-[520px] max-w-[90vw] max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-Subtitle_L_Medium text-black font-bold">
              {config.title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="닫기"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 검색바 */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5">
              <SearchIcon className="shrink-0" />
              <input
                type="text"
                placeholder={config.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-Body_M_Light text-black placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* 스크롤 목록 */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-6 pb-2">
            <div className="flex flex-col gap-2">
              {filtered.map((item) => {
                const medal = getRankMedal(item.currentRanking);
                const isMySquad = item.squadId === mySquadId;

                return (
                  <div
                    key={item.squadId}
                    ref={isMySquad ? myItemRef : undefined}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-all",
                      isMySquad
                        ? "bg-main-1/10 border-main-1"
                        : "bg-white border-transparent hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-Body_M_Light text-black w-8 text-center font-medium">
                        {medal ?? `#${item.currentRanking}`}
                      </span>
                      <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                        {item.squadName.substring(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-Body_M_Light text-black font-medium">
                          {item.squadName}
                          {isMySquad && (
                            <span className="ml-2 text-Caption_M_Light text-main-1 font-bold">
                              내 학교
                            </span>
                          )}
                        </span>
                        <span className="text-Caption_L_Light text-gray-400">
                          {item.weeklyXp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                    <span className="text-Body_M_Light text-black font-medium">
                      {item.weeklyXpChangeRate >= 0 ? "+" : ""}
                      {item.weeklyXpChangeRate.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-Body_M_Light">
                  검색 결과가 없습니다
                </p>
              )}
            </div>
          </div>

          {/* 하단 버튼 */}
          {mySquadId != null && (
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleScrollToMe}
                className="w-full py-2.5 text-Body_M_Light text-main-1 font-medium bg-main-1/10 rounded-lg hover:bg-main-1/20 transition-colors"
              >
                {config.scrollButtonLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 기여도 variant
  const sorted = [...contributionItems].sort((a, b) => a.ranking - b.ranking);
  const filtered = searchQuery
    ? sorted.filter((item) =>
        item.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sorted;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.43)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-[0px_5px_15px_0px_rgba(0,0,0,0.25)] w-[520px] max-w-[90vw] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-Subtitle_L_Medium text-black font-bold">
            {config.title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 검색바 */}
        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5">
            <SearchIcon className="shrink-0" />
            <input
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-Body_M_Light text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 스크롤 목록 */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-6 pb-2">
          <div className="flex flex-col gap-2">
            {filtered.map((item) => {
              const isMe = item.nickname === myNickname;

              return (
                <div
                  key={item.nickname}
                  ref={isMe ? myItemRef : undefined}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    isMe
                      ? "bg-main-1/10 border-main-1"
                      : "bg-white border-transparent hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-Body_M_Light text-black w-8 text-center font-medium">
                      {item.ranking <= 3
                        ? getRankMedal(item.ranking)
                        : `#${item.ranking}`}
                    </span>
                    <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                      {item.nickname.substring(0, 1)}
                    </div>
                    <span className="text-Body_M_Light text-black font-medium">
                      {item.nickname}
                      {isMe && (
                        <span className="ml-2 text-Caption_M_Light text-main-1 font-bold">
                          나
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-Body_M_Light text-main-1 font-bold">
                    +{item.weeklyContributionXp.toLocaleString()} XP
                  </span>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-Body_M_Light">
                검색 결과가 없습니다
              </p>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        {myNickname && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleScrollToMe}
              className="w-full py-2.5 text-Body_M_Light text-main-1 font-medium bg-main-1/10 rounded-lg hover:bg-main-1/20 transition-colors"
            >
              {config.scrollButtonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SquadRankingModal;
