import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MyChallengeHistoryItem } from "@/components/MyChallengeHistoryItem";
import { CompletedChallengeItem } from "@/components/CompletedChallengeItem";
import { cn } from "@/utils/cn";
import {
  BADGE_CONFIG,
  ALL_BADGE_TYPES,
} from "@/components/Badge/badgeConfig";
import {
  gamificationApi,
  type MyChallengeItem,
  type ChallengeHistoryItem,
  type BadgeInfo,
} from "@/api/gamification";

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return dateString;
  }
};

const getDaysUntilEnd = (endDate: string): number => {
  const matched = endDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matched) return 0;

  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return 0;

  // endDate 당일 23:59:59까지 유효하도록 로컬 타임 기준 계산
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  if (Number.isNaN(end.getTime())) return 0;

  const diffMs = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const clampProgress = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatCurrentYearMonth = () => {
  const today = new Date();
  return {
    year: String(today.getFullYear()),
    month: String(today.getMonth() + 1).padStart(2, "0"),
  };
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs = 8000): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("request timeout"));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const MyChallengeHistoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // 진행중인 챌린지
  const [ongoingChallenges, setOngoingChallenges] = useState<MyChallengeItem[]>([]);
  
  // 달성 완료 챌린지
  const [completedChallenges, setCompletedChallenges] = useState<ChallengeHistoryItem[]>([]);
  
  // 획득 배지
  const [badges, setBadges] = useState<BadgeInfo[]>([]);
  
  // 통합된 달성 완료 항목 (챌린지 완료 + 배지 획득)
  type AchievementItem = 
    | { type: "challenge"; data: ChallengeHistoryItem }
    | { type: "badge"; data: BadgeInfo };
  
  const allAchievements = useMemo(() => {
    const items: AchievementItem[] = [];
    
    // 챌린지 완료 항목 추가
    completedChallenges.forEach((challenge) => {
      items.push({ type: "challenge", data: challenge });
    });
    
    // 배지 획득 항목 추가
    badges.forEach((badge) => {
      items.push({ type: "badge", data: badge });
    });
    
    // 날짜순 정렬 (최신순)
    return items.sort((a, b) => {
      const dateA = a.type === "challenge" ? a.data.completedAt : a.data.acquiredAt;
      const dateB = b.type === "challenge" ? b.data.completedAt : b.data.acquiredAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [completedChallenges, badges]);
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allAchievements.length / itemsPerPage);
  const paginatedAchievements = allAchievements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const completedCount = allAchievements.length;

  // 모든 배지 목록 (획득한 것과 미획득한 것 모두 포함, 중복 제거)
  const allBadges = useMemo(() => {
    // 획득한 배지 맵 생성 (중복 제거)
    const acquiredBadgesMap = new Map<string, BadgeInfo>();
    badges.forEach((badge) => {
      if (!acquiredBadgesMap.has(badge.badge)) {
        acquiredBadgesMap.set(badge.badge, badge);
      }
    });

    // 모든 배지 타입에 대해 획득 여부 확인
    return ALL_BADGE_TYPES.map((badgeType) => {
      const acquiredBadge = acquiredBadgesMap.get(badgeType);
      return {
        badgeType,
        isAcquired: !!acquiredBadge,
        displayName: acquiredBadge?.displayName || BADGE_CONFIG[badgeType].displayName,
        acquiredAt: acquiredBadge?.acquiredAt,
      };
    });
  }, [badges]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 실제 API 호출
        const { year, month } = formatCurrentYearMonth();

        const [challengesResult, completedResult, badgesResult] = await Promise.allSettled([
          withTimeout(gamificationApi.getMyChallenges()),
          withTimeout(gamificationApi.getCompletedChallenges(year, month)),
          withTimeout(gamificationApi.getMyBadges()),
        ]);

        if (cancelled) return;

        if (challengesResult.status === "fulfilled") {
          // 진행중인 챌린지만 필터링 (achieved가 false인 것)
          const ongoing = challengesResult.value.filter((c) => !c.achieved);
          setOngoingChallenges(ongoing);
        } else {
          console.error("챌린지 데이터 로딩 실패:", challengesResult.reason);
        }

        if (completedResult.status === "fulfilled") {
          setCompletedChallenges(completedResult.value);
        } else {
          console.error("완료된 챌린지 데이터 로딩 실패:", completedResult.reason);
        }

        if (badgesResult.status === "fulfilled") {
          setBadges(badgesResult.value);
        } else {
          console.error("배지 데이터 로딩 실패:", badgesResult.reason);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
        <main className="px-8 2xl:px-60 py-5">
          <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-8 py-5">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mb-4" />
              <div className="h-32 bg-gray-300 rounded w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)]">
      <main className="px-8 2xl:px-60 py-5">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-8 py-5">
          {/* 타이틀 */}
          <div className="w-full px-12 py-2.5 flex items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-5 text-Headline_L_Bold text-black"
            >
              <span
                className="w-8 h-8 flex items-center justify-center text-Headline_L_Bold leading-none"
                aria-hidden="true"
              >
                ←
              </span>
              나의 챌린지 내역
            </button>
          </div>

        {/* 진행중인 챌린지 */}
        <div className="flex items-center p-[10px] relative w-full">
          <h2 className="text-Title_L_Medium text-black">진행중인 챌린지</h2>
        </div>
        <div className="flex gap-[53px] items-center relative w-full flex-wrap">
          {ongoingChallenges.length > 0 ? (
            ongoingChallenges.map((challenge) => {
              // API에서 제공하는 progressPercentage를 사용하되, 없으면 계산
              const progress = challenge.progressPercentage ?? 
                (challenge.targetValue > 0 
                  ? (challenge.currentValue / challenge.targetValue) * 100 
                  : 0);
              const clampedProgress = clampProgress(progress, 0, 100);
              const remainingDays = getDaysUntilEnd(challenge.endDate);
              
              return (
                <MyChallengeHistoryItem
                  key={challenge.id}
                  title={challenge.title}
                  progress={clampedProgress}
                  remainingDays={remainingDays}
                  rewardXp={challenge.rewardXp}
                  stockName={undefined} // API 응답에 종목명이 없으므로 undefined
                  className="w-[320px]"
                />
              );
            })
          ) : (
            <p className="text-Body_L_Light text-gray-400 py-8">
              진행중인 챌린지가 없습니다.
            </p>
          )}
        </div>

        {/* 달성 완료 */}
        <div className="flex gap-[10px] items-end p-[10px] relative w-full">
          <h2 className="text-Title_L_Medium text-black">달성 완료</h2>
          <div className="flex flex-col justify-end leading-[0] relative shrink-0">
            <p className="leading-[22px] text-Body_L_Light text-gray-300 whitespace-nowrap">
              {completedCount}개
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-[15px] items-start relative w-full">
          {paginatedAchievements.length > 0 ? (
            <>
              {paginatedAchievements.map((item, index) => {
                if (item.type === "challenge") {
                  return (
                    <CompletedChallengeItem
                      key={`challenge-${item.data.challengeId}`}
                      title={item.data.title}
                      completedDate={formatDate(item.data.completedAt)}
                      stockName={undefined} // API 응답에 종목명이 없으므로 undefined
                      type="challenge"
                    />
                  );
                } else {
                  return (
                    <CompletedChallengeItem
                      key={`badge-${item.data.badge}-${index}`}
                      title={item.data.displayName}
                      completedDate={formatDate(item.data.acquiredAt)}
                      stockName={undefined}
                      type="badge"
                      badgeCode={item.data.badge}
                    />
                  );
                }
              })}
              
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex gap-[10px] items-center justify-center px-5 py-[14px] relative w-full">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "flex flex-col items-center justify-center p-1 relative shrink-0 cursor-pointer",
                        currentPage === page
                          ? "border-b-[1.5px] border-main-1"
                          : ""
                      )}
                      aria-label={`${page}페이지로 이동`}
                    >
                      <p
                        className={cn(
                          "text-Subtitle_L_Regular whitespace-pre-wrap",
                          currentPage === page ? "text-main-1" : "text-gray-200"
                        )}
                      >
                        {page}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-Body_L_Light text-gray-400 py-8 w-full text-center">
              달성 완료 항목이 없습니다.
            </p>
          )}
        </div>

        {/* 획득 배지 */}
        <div className="flex items-end p-[10px] relative w-full">
          <h2 className="text-Title_L_Medium text-black">획득 배지</h2>
        </div>
        <div className="bg-white border border-gray-300 border-solid rounded-lg px-[100px] py-[50px] relative w-full">
          <div className="grid grid-cols-4 gap-[80px] items-start">
            {allBadges.map((badge) => {
              const config = BADGE_CONFIG[badge.badgeType];
              const isAcquired = badge.isAcquired;
              
              // 마이페이지에서만 아이콘 크기 조정 (원 100px, 아이콘 70px)
              const renderIcon = () => {
                const iconElement = config.icon(isAcquired);
                if (isAcquired && React.isValidElement(iconElement)) {
                  return React.cloneElement(iconElement, {
                    className: "w-[50px] h-[50px]",
                  } as React.HTMLAttributes<SVGElement>);
                }
                return iconElement;
              };
              
              return (
                <div
                  key={badge.badgeType}
                  className="flex flex-col gap-[14px] items-center justify-center relative shrink-0"
                >
                  <div className="relative shrink-0 size-[100px]">
                    <div className={cn(
                      "w-full h-full rounded-full flex items-center justify-center border-2 border-gray-300",
                      isAcquired ? "" : "bg-gray-100"
                    )}>
                      {renderIcon()}
                    </div>
                  </div>
                  <p className="text-Subtitle_L_Medium text-black text-center whitespace-pre-wrap">
                    {isAcquired ? badge.displayName : "미획득"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default MyChallengeHistoryPage;

