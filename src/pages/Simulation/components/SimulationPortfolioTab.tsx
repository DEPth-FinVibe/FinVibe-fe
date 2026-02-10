import React, { useEffect, useRef, useState, memo } from "react";
import { cn } from "@/utils/cn";
import CloseIcon from "@/assets/svgs/CloseIcon";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import { assetPortfolioApi, type PortfolioAsset } from "@/api/asset";
import { useMarketStore, useQuote } from "@/store/useMarketStore";
import { formatPriceWithSymbol, formatChangeRate } from "@/utils/formatStock";

export type SimulationPortfolioGroup = {
  id: number;
  name: string;
  iconCode: string;
};

type Props = {
  /** 포트폴리오 폴더 리스트(더미) */
  groups?: SimulationPortfolioGroup[];
  isLoading?: boolean;
  isCreating?: boolean;
  createErrorMessage?: string | null;
  isUpdating?: boolean;
  updatingGroupId?: number | null;
  updateErrorMessage?: string | null;
  isDeleting?: boolean;
  deletingGroupId?: number | null;
  deleteErrorMessage?: string | null;
  /** 새 폴더 버튼 클릭 (API 연동 전이므로 선택) */
  onClickCreateFolder?: () => void;
  /** 폴더 생성 '추가' 클릭 (API 연동 전이므로 선택) */
  onSubmitCreateFolder?: (name: string) => Promise<void> | void;
  /** 폴더명 수정 '저장' 클릭 */
  onSubmitUpdateGroupName?: (groupId: number, name: string) => Promise<void> | void;
  /** 폴더 삭제 */
  onDeleteGroup?: (groupId: number) => Promise<void> | void;
  className?: string;
};

const FolderMintIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
      role="img"
      aria-hidden="true"
    >
      <path
        d="M10 3H4C2.9 3 2.01 4.0125 2.01 5.25L2 18.75C2 19.9875 2.9 21 4 21H20C21.1 21 22 19.9875 22 18.75V7.5C22 6.2625 21.1 5.25 20 5.25H12L10 3Z"
        fill="#42D6BA"
      />
    </svg>
  );
};

const PenIcon: React.FC<{ className?: string; ariaLabel?: string }> = ({
  className,
  ariaLabel,
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <path
        d="M18.9395 4.83984L5.00684 18.7715L0.832031 19.167L1.22754 14.9922L15.1602 1.06055L18.9395 4.83984Z"
        stroke="#717478"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const TrashIcon: React.FC<{ className?: string; ariaLabel?: string }> = ({
  className,
  ariaLabel,
}) => {
  return (
    <svg
      viewBox="0 0 17.2969 19.8779"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-6", className)}
      role="img"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <path
        d="M12.6416 2.43262H17.2969V3.93262H15.8848V19.8779H1.41211V3.93262H0V2.43262H4.65527V0H12.6416V2.43262ZM2.91211 18.3779H14.3848V3.93262H2.91211V18.3779ZM7.50684 14.8037H6.00684V7.23633H7.50684V14.8037ZM11.291 14.8037H9.79102V7.23633H11.291V14.8037ZM6.15527 2.43262H11.1416V1.5H6.15527V2.43262Z"
        fill="#717478"
      />
    </svg>
  );
};

// 실시간 가격 업데이트를 위한 포트폴리오 자산 아이템 컴포넌트
interface PortfolioAssetItemProps {
  asset: PortfolioAsset;
}

const PortfolioAssetItem = memo(({ asset }: PortfolioAssetItemProps) => {
  const quote = useQuote(asset.stockId);

  // 실시간 데이터가 있으면 사용, 없으면 0으로 표시
  const currentPrice = quote?.close ?? 0;
  const changeRate = quote?.prevDayChangePct ?? 0;

  const isPositive = changeRate >= 0;
  const changeRateText = formatChangeRate(changeRate);
  const totalPriceNum = typeof asset.totalPrice === "number" ? asset.totalPrice : Number(asset.totalPrice);
  const price = asset.currency === "USD"
    ? `$${totalPriceNum.toFixed(2)}`
    : formatPriceWithSymbol(currentPrice);

  return (
    <div
      className="border border-sub-gray rounded-lg h-[49px] flex items-center justify-between px-5 py-2.5"
    >
      <div className="flex flex-col items-start w-[132px]">
        <div className="flex items-center gap-4">
          <p className="text-Subtitle_S_Regular text-sub-blue">
            {asset.name}
          </p>
          <p className="text-Caption_M_Light text-black">
            {asset.stockId}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end w-[105px]">
        <p className="text-Body_S_Light text-gray-400 text-right">
          {price}
        </p>
        <div className="flex items-center gap-1">
          <ChangeRateIcon
            className="h-[26px] w-6"
            color={isPositive ? "#FF0000" : "#001AFF"}
            direction={isPositive ? "up" : "down"}
            ariaLabel="등락률"
          />
          <p className={cn(
            "text-Body_S_Light text-right w-12",
            isPositive ? "text-etc-red" : "text-etc-blue"
          )}>
            {changeRateText}
          </p>
        </div>
      </div>
    </div>
  );
});

const SimulationPortfolioTab: React.FC<Props> = ({
  groups = [],
  isLoading = false,
  isCreating = false,
  createErrorMessage = null,
  isUpdating = false,
  updatingGroupId = null,
  updateErrorMessage = null,
  isDeleting = false,
  deletingGroupId = null,
  deleteErrorMessage = null,
  onClickCreateFolder,
  onSubmitCreateFolder,
  onSubmitUpdateGroupName,
  onDeleteGroup,
  className,
}) => {
  const { subscribe, unsubscribe } = useMarketStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<number>>(new Set());
  const [portfolioAssets, setPortfolioAssets] = useState<Record<number, PortfolioAsset[]>>({});
  const [loadingAssets, setLoadingAssets] = useState<Set<number>>(new Set());

  // 포트폴리오 그룹이 변경될 때마다 각 포트폴리오의 자산 개수 미리 로드
  useEffect(() => {
    if (groups.length === 0) return;
    
    let cancelled = false;
    const loadAssetCounts = async () => {
      const assetCounts: Record<number, PortfolioAsset[]> = {};
      
      // 모든 포트폴리오의 자산 개수를 병렬로 로드
      await Promise.all(
        groups.map(async (group) => {
          try {
            const assets = await assetPortfolioApi.getAssetsByPortfolio(group.id);
            if (!cancelled) {
              assetCounts[group.id] = assets;
            }
          } catch {
            // 에러 발생 시 빈 배열로 설정
            if (!cancelled) {
              assetCounts[group.id] = [];
            }
          }
        })
      );
      
      if (!cancelled) {
        setPortfolioAssets((prev) => ({ ...prev, ...assetCounts }));
      }
    };

    loadAssetCounts();
    
    return () => {
      cancelled = true;
    };
  }, [groups]);

  useEffect(() => {
    if (!isCreateOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [isCreateOpen]);

  useEffect(() => {
    if (editingGroupId == null) return;
    const id = window.setTimeout(() => editInputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [editingGroupId]);

  const closeCreate = () => {
    setIsCreateOpen(false);
    setFolderName("");
  };

  const submitCreate = async () => {
    const name = folderName.trim();
    if (name.length === 0) return;
    try {
      await onSubmitCreateFolder?.(name);
      closeCreate();
    } catch {
      // parent에서 에러 메시지를 내려주면 하단에 표시 (입력줄은 유지)
    }
  };

  const startEdit = (g: SimulationPortfolioGroup) => {
    setEditingGroupId(g.id);
    setEditingName(g.name);
  };

  const cancelEdit = () => {
    setEditingGroupId(null);
    setEditingName("");
  };

  const submitEdit = async () => {
    if (editingGroupId == null) return;
    const nextName = editingName.trim();
    if (nextName.length === 0) return;
    try {
      await onSubmitUpdateGroupName?.(editingGroupId, nextName);
      cancelEdit();
    } catch {
      // parent에서 에러 메시지를 내려주면 유지
    }
  };

  const submitDelete = async (groupId: number) => {
    try {
      await onDeleteGroup?.(groupId);
      // parent에서 refetch까지 처리
      if (editingGroupId === groupId) cancelEdit();
      // 삭제된 포트폴리오의 확장 상태 및 자산 데이터 제거
      setExpandedGroupIds((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setPortfolioAssets((prev) => {
        const next = { ...prev };
        delete next[groupId];
        return next;
      });
    } catch {
      // parent에서 에러 메시지 내려주면 표시
    }
  };

  const toggleExpand = async (groupId: number) => {
    // 편집 중이면 확장/축소 불가
    if (editingGroupId === groupId) return;

    const isExpanded = expandedGroupIds.has(groupId);
    if (isExpanded) {
      // 축소
      setExpandedGroupIds((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
    } else {
      // 확장
      setExpandedGroupIds((prev) => new Set(prev).add(groupId));

      // 이미 로드된 데이터가 있으면 스킵
      if (portfolioAssets[groupId]) return;

      // 자산 데이터 로드
      setLoadingAssets((prev) => new Set(prev).add(groupId));
      try {
        const assets = await assetPortfolioApi.getAssetsByPortfolio(groupId);
        setPortfolioAssets((prev) => ({ ...prev, [groupId]: assets }));
      } catch {
        // 에러 발생 시 빈 배열로 설정
        setPortfolioAssets((prev) => ({ ...prev, [groupId]: [] }));
      } finally {
        setLoadingAssets((prev) => {
          const next = new Set(prev);
          next.delete(groupId);
          return next;
        });
      }
    }
  };

  // 확장된 포트폴리오의 종목들에 대해 웹소켓 구독 처리
  useEffect(() => {
    const stockIds: number[] = [];

    // 확장된 포트폴리오의 모든 종목 ID 수집
    expandedGroupIds.forEach((groupId) => {
      const assets = portfolioAssets[groupId] ?? [];
      assets.forEach((asset) => {
        stockIds.push(asset.stockId);
      });
    });

    if (stockIds.length > 0) {
      subscribe(stockIds);
    }

    // 컴포넌트 언마운트 또는 확장 상태 변경 시 구독 해제
    return () => {
      if (stockIds.length > 0) {
        unsubscribe(stockIds);
      }
    };
  }, [expandedGroupIds, portfolioAssets, subscribe, unsubscribe]);

  return (
    <div className={cn("w-[445px] flex flex-col gap-7.5 pt-2.5", className)}>
      {/* 헤더: 내 포트폴리오 + 새 폴더 버튼 */}
      <div className="flex items-center justify-between px-2.5">
        <p className="text-Subtitle_S_Regular text-black">내 포트폴리오</p>
        <button
          type="button"
          onClick={() => {
            onClickCreateFolder?.();
            setIsCreateOpen(true);
          }}
          disabled={isCreating || isUpdating || isDeleting}
          className={cn(
            "inline-flex items-center justify-center",
            "rounded-[14px] bg-main-1",
            "px-4 py-1",
            "text-Caption_L_Light text-white",
            (isCreating || isUpdating || isDeleting) &&
              "opacity-60 cursor-not-allowed"
          )}
        >
          + 새 폴더
        </button>
      </div>

      {/* 새 폴더 입력 바 (Figma: 1086:37595) */}
      {isCreateOpen && (
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex items-center gap-2.5">
            <input
              ref={inputRef}
              value={folderName}
              disabled={isCreating}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitCreate();
                if (e.key === "Escape") closeCreate();
              }}
              placeholder="폴더명 검색"
              className={cn(
                "flex-1 h-[36px]",
                "rounded-[8px] border border-gray-300 bg-white",
                "px-5 py-2.5",
                "text-Body_M_Light text-gray-400",
                "placeholder:text-gray-400",
                "focus:outline-none",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
              aria-label="폴더명 입력"
            />

            <button
              type="button"
              onClick={submitCreate}
              disabled={isCreating || folderName.trim().length === 0}
              className={cn(
                "h-[36px] rounded-[8px] bg-main-1",
                "px-5 py-2.5",
                "text-Caption_L_Light text-white",
                "inline-flex items-center justify-center",
                (isCreating || folderName.trim().length === 0) &&
                  "opacity-60 cursor-not-allowed"
              )}
            >
              추가
            </button>
            <button
              type="button"
              onClick={closeCreate}
              disabled={isCreating}
              className={cn(
                "h-[36px] rounded-[8px] bg-white border border-gray-300",
                "px-[15px] py-2.5",
                "inline-flex items-center justify-center",
                isCreating && "opacity-60 cursor-not-allowed"
              )}
              aria-label="폴더 추가 취소"
            >
              <CloseIcon className="size-6" ariaLabel="닫기" />
            </button>
          </div>

          {createErrorMessage && (
            <p className="text-Caption_L_Light text-etc-red px-1">
              {createErrorMessage}
            </p>
          )}
        </div>
      )}

      {/* 폴더 리스트 */}
      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="w-full rounded-lg border border-gray-300 py-4 px-5 text-Subtitle_S_Regular text-gray-400">
            불러오는 중...
          </div>
        ) : groups.length === 0 ? (
          <div className="w-full rounded-lg border border-gray-300 py-4 px-5 text-Subtitle_S_Regular text-gray-400">
            표시할 포트폴리오가 없어요.
          </div>
        ) : (
          groups.map((g) => {
            const isExpanded = expandedGroupIds.has(g.id);
            const assets = portfolioAssets[g.id] ?? [];
            const assetCount = assets.length;
            const isLoadingAssets = loadingAssets.has(g.id);

            return (
              <div
                key={g.id}
                className={cn(
                  "w-full rounded-lg border border-main-1",
                  isExpanded ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg",
                  isExpanded && "bg-etc-light-mint"
                )}
              >
                <div
                  className={cn(
                    "w-full px-5 flex items-center justify-between",
                    isExpanded ? "py-4 border-b border-main-1" : "py-4",
                    assetCount > 0 && editingGroupId !== g.id && "cursor-pointer"
                  )}
                  onClick={() => assetCount > 0 && toggleExpand(g.id)}
                  role={assetCount > 0 && editingGroupId !== g.id ? "button" : undefined}
                  tabIndex={assetCount > 0 && editingGroupId !== g.id ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (assetCount > 0 && editingGroupId !== g.id && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      toggleExpand(g.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderMintIcon />
                    <div className="flex items-center gap-2.5">
                      {editingGroupId === g.id ? (
                        <input
                          ref={editInputRef}
                          value={editingName}
                          disabled={isUpdating && updatingGroupId === g.id}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") submitEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "h-9 w-[200px]",
                            "rounded-lg border border-gray-300 bg-white",
                            "px-4 py-2",
                            "text-Body_M_Light text-black",
                            "placeholder:text-gray-400",
                            "focus:outline-none",
                            "disabled:opacity-60 disabled:cursor-not-allowed"
                          )}
                          aria-label="폴더명 수정"
                        />
                      ) : (
                        <p className="text-Subtitle_S_Regular text-black">
                          {g.name}
                        </p>
                      )}
                      <p className="text-Caption_L_Light text-black">
                        ({assetCount})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-5">
                    {editingGroupId === g.id ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            submitEdit();
                          }}
                          disabled={
                            (isUpdating && updatingGroupId === g.id) ||
                            editingName.trim().length === 0
                          }
                          className={cn(
                            "h-9 rounded-lg bg-main-1",
                            "px-5 py-2.5",
                            "text-Caption_L_Light text-white",
                            ((isUpdating && updatingGroupId === g.id) ||
                              editingName.trim().length === 0) &&
                              "opacity-60 cursor-not-allowed"
                          )}
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                          disabled={isUpdating && updatingGroupId === g.id}
                          className={cn(
                            "h-9 rounded-lg bg-white border border-gray-300",
                            "px-4",
                            "inline-flex items-center justify-center",
                            (isUpdating && updatingGroupId === g.id) &&
                              "opacity-60 cursor-not-allowed"
                          )}
                          aria-label="수정 취소"
                        >
                          <CloseIcon className="size-6" ariaLabel="닫기" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="p-0"
                          aria-label="폴더 편집"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(g);
                          }}
                          disabled={isCreating || isUpdating || isDeleting}
                        >
                          <PenIcon ariaLabel="편집" />
                        </button>
                        <button
                          type="button"
                          className="p-0"
                          aria-label="폴더 삭제"
                          disabled={
                            isCreating ||
                            isUpdating ||
                            isDeleting ||
                            (isDeleting && deletingGroupId === g.id)
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            submitDelete(g.id);
                          }}
                        >
                          <TrashIcon ariaLabel="삭제" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 확장된 포트폴리오 내 종목 목록 */}
                {isExpanded && (
                  <div className="bg-etc-light-mint flex flex-col gap-1 px-5 py-4 rounded-bl-lg rounded-br-lg">
                    {isLoadingAssets ? (
                      <div className="text-Caption_L_Light text-gray-400 py-2">
                        로딩 중...
                      </div>
                    ) : assets.length === 0 ? (
                      <div className="text-Caption_L_Light text-gray-400 py-2">
                        종목이 없습니다.
                      </div>
                    ) : (
                      assets.map((asset) => (
                        <PortfolioAssetItem key={asset.id} asset={asset} />
                      ))
                    )}
                  </div>
                )}

                {editingGroupId === g.id &&
                  updateErrorMessage &&
                  updatingGroupId === g.id && (
                    <p className="text-Caption_L_Light text-etc-red px-5 pt-2">
                      {updateErrorMessage}
                    </p>
                  )}

                {deleteErrorMessage && deletingGroupId === g.id && (
                  <p className="text-Caption_L_Light text-etc-red px-5 pt-2">
                    {deleteErrorMessage}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SimulationPortfolioTab;


