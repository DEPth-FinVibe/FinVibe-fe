import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import FolderReturnComparisonSection from "@/pages/MyPage/components/FolderReturnComparisonSection";
import CreateFolderPopover from "@/pages/MyPage/components/CreateFolderPopover";
import MoveToFolderPopover from "@/pages/MyPage/components/MoveToFolderPopover";
import { assetPortfolioApi, type PortfolioAsset, type PortfolioGroup, type PortfolioComparisonItem } from "@/api/asset";
import { formatPrice, formatChangeRate } from "@/utils/formatStock";

type FolderMeta = {
  id: number;
  label: string;
  iconCode: string;
  tone: "red" | "blue" | "purple" | "green" | "orange" | "pink" | "yellow" | "cyan";
};

type StockRow = {
  id: string;
  name: string;
  qty: string;
  price: string;
  folderId: number | null;
  stockId: number;
};

const formatMoney = (value: number, currency: string) => {
  if (!Number.isFinite(value)) return "-";
  if (currency === "USD") return `$${value.toLocaleString()}`;
  if (currency === "KRW") return `₩${value.toLocaleString()}`;
  return `${value.toLocaleString()} ${currency}`;
};

const toStockRow = (asset: PortfolioAsset, folderId: number): StockRow => {
  return {
    id: String(asset.id),
    name: asset.name,
    qty: `${asset.amount}주`,
    // NOTE: 응답에는 현재가가 없어서, 우선 총 평가금액(totalPrice)을 표시 (디자인은 그대로)
    price: formatMoney(asset.totalPrice, asset.currency),
    folderId,
    stockId: asset.stockId,
  };
};

// 포트폴리오 추가 순서에 따라 색상 결정
const getToneByIndex = (index: number): FolderMeta["tone"] => {
  const tones: FolderMeta["tone"][] = [
    "red",
    "blue",
    "purple",
    "green",
    "orange",
    "pink",
    "yellow",
    "cyan",
  ];
  return tones[index % tones.length];
};

const FolderChip: React.FC<{ folder: FolderMeta }> = ({ folder }) => {
  const getStyles = (tone: FolderMeta["tone"]) => {
    switch (tone) {
      case "red":
        return "bg-etc-light-red text-etc-red";
      case "blue":
        return "bg-etc-light-blue text-etc-blue";
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "green":
        return "bg-green-100 text-green-600";
      case "orange":
        return "bg-orange-100 text-orange-600";
      case "pink":
        return "bg-pink-100 text-pink-600";
      case "yellow":
        return "bg-yellow-100 text-yellow-600";
      case "cyan":
        return "bg-cyan-100 text-cyan-600";
      default:
        return "bg-white border border-gray-300 text-[#4C4C4C]";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full",
        getStyles(folder.tone)
      )}
    >
      <span className="text-Subtitle_S_Regular">{folder.label}</span>
    </span>
  );
};

const MyPortfolioManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"folder" | "all">("folder");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const showFolderColumn = tab === "folder";
  const [portfolioGroups, setPortfolioGroups] = useState<PortfolioGroup[] | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [createFolderError, setCreateFolderError] = useState<string | null>(null);
  const [openMoveRowId, setOpenMoveRowId] = useState<string | null>(null);
  const [movePendingFolderId, setMovePendingFolderId] = useState<number | null>(null);

  const [rows, setRows] = useState<StockRow[]>([]);
  const [comparisonData, setComparisonData] = useState<PortfolioComparisonItem[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const groups = await assetPortfolioApi.getPortfolios();
        if (!alive) return;
        setPortfolioGroups(Array.isArray(groups) ? groups : []);
      } catch {
        // 실패 시 더미 대신 비어있게
        if (!alive) return;
        setPortfolioGroups([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 포트폴리오 비교 데이터 조회
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await assetPortfolioApi.getPortfolioComparison();
        if (!alive) return;
        setComparisonData(Array.isArray(data) ? data : []);
      } catch {
        // 실패 시 빈 배열
        if (!alive) return;
        setComparisonData([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (portfolioGroups === null) return; // 그룹 로딩 전
      if (portfolioGroups.length === 0) {
        setRows([]);
        return;
      }

      try {
        const results = await Promise.all(
          portfolioGroups.map(async (g) => {
            try {
              const assets = await assetPortfolioApi.getAssetsByPortfolio(g.id);
              return (Array.isArray(assets) ? assets : []).map((a) => toStockRow(a, g.id));
            } catch {
              // 한 포트폴리오 조회 실패해도 나머지는 최대한 표시
              return [] as StockRow[];
            }
          })
        );
        if (!alive) return;
        setRows(results.flat());
      } catch {
        if (!alive) return;
        // 실패 시 더미 대신 비어있게
        setRows([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [portfolioGroups]);

  const refetchGroups = async () => {
    const groups = await assetPortfolioApi.getPortfolios();
    setPortfolioGroups(Array.isArray(groups) ? groups : []);
  };

  // 제한 없이 그대로 사용 (비어있으면 빈 상태 유지)
  const groupsForUi = portfolioGroups ?? [];

  const folderOptions: FolderMeta[] = groupsForUi.map((g, index) => ({
    id: g.id,
    label: g.name,
    iconCode: g.iconCode,
    tone: getToneByIndex(index),
  }));

  const folderById = useMemo(() => {
    return new Map(folderOptions.map((f) => [f.id, f]));
  }, [folderOptions]);

  const barData = useMemo(() => {
    // API 데이터를 폴더명으로 매칭
    const comparisonMap = new Map(comparisonData.map((item) => [item.name, item]));
    
    return folderOptions.map((f) => {
      const comparison = comparisonMap.get(f.label);
      return {
        label: f.label,
        value: comparison?.returnRate ?? 0,
        tone: f.tone,
      };
    });
  }, [folderOptions, comparisonData]);

  // 폴더별 비교 데이터 맵
  const comparisonByFolderName = useMemo(() => {
    return new Map(comparisonData.map((item) => [item.name, item]));
  }, [comparisonData]);

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
              <span className="w-8 h-8 flex items-center justify-center text-Headline_L_Bold leading-none" aria-hidden="true">
                ←
              </span>
              포트폴리오 관리
            </button>
          </div>

          {/* 1) 폴더별 수익률 비교 */}
          <section className="bg-white border border-gray-300 rounded-lg w-full px-10 py-8 flex flex-col gap-8">
            <div className="w-full py-2.5">
              <h2 className="text-Title_L_Medium text-black">포트폴리오별 수익률 비교</h2>
            </div>

            {/* 차트(바) + 요약 테이블 */}
            <div className="w-full flex flex-col gap-6">
              {/* Bar chart */}
              <FolderReturnComparisonSection barData={barData} />

              {/* 요약 테이블 (폴더명/총 평가금/수익률/실현 수익) */}
              <div className="w-full">
                <div className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] gap-6 items-center px-5 py-5 border-b border-gray-300 text-Subtitle_L_Medium text-black">
                  <div>포트폴리오명</div>
                  <div>총 평가금</div>
                  <div>수익률</div>
                  <div className="text-right">실현 수익</div>
                </div>

                {folderOptions.length === 0 ? (
                  <div className="px-5 py-8 text-Subtitle_M_Regular text-gray-400">
                    표시할 포트폴리오가 없어요.
                  </div>
                ) : (
                  folderOptions.map((f) => {
                    const comparison = comparisonByFolderName.get(f.label);
                    return (
                      <div
                        key={f.id}
                        className="grid grid-cols-[1.5fr_1fr_0.7fr_0.7fr] gap-6 items-center px-5 py-5 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <p className="text-Subtitle_L_Medium text-black">{f.label}</p>
                        </div>

                        <p className="text-Subtitle_L_Regular text-[#364153]">
                          {comparison ? formatPrice(comparison.totalAssetAmount) : "-"}
                        </p>
                        <p className={cn(
                          "text-Subtitle_M_Medium",
                          comparison?.returnRate 
                            ? (comparison.returnRate >= 0 ? "text-etc-red" : "text-etc-blue")
                            : "text-[#364153]"
                        )}>
                          {comparison ? formatChangeRate(comparison.returnRate) : "-"}
                        </p>
                        <p className={cn(
                          "text-right text-Subtitle_S_Regular",
                          comparison?.realizedProfit
                            ? (comparison.realizedProfit >= 0 ? "text-etc-red" : "text-etc-blue")
                            : "text-[#101828]"
                        )}>
                          {comparison ? formatPrice(comparison.realizedProfit) : "-"}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* 2) 폴더/종목 관리 테이블 */}
          <section className="bg-white border border-gray-300 rounded-lg w-full p-10 flex flex-col gap-10">
            {/* 상단 버튼 */}
            <div className="relative w-fit">
              <button
                type="button"
                className={cn(
                  "bg-sub-blue text-white",
                  "rounded-lg",
                  "px-4 py-2.5",
                  "w-fit",
                  "inline-flex items-center justify-center gap-1",
                  "text-Subtitle_L_Regular"
                )}
                onClick={() => setIsCreateFolderOpen((v) => !v)}
              >
                <span className="text-white text-Subtitle_L_Regular leading-none" aria-hidden="true">
                  +
                </span>
                새 포트폴리오 만들기
              </button>

              <CreateFolderPopover
                isOpen={isCreateFolderOpen}
                value={newFolderName}
                onChange={setNewFolderName}
                onClose={() => setIsCreateFolderOpen(false)}
                isSubmitting={isCreatingFolder}
                errorMessage={createFolderError}
                onSubmit={async () => {
                  const name = newFolderName.trim();
                  if (name.length === 0) return;

                  setCreateFolderError(null);
                  setIsCreatingFolder(true);
                  try {
                    // NOTE: iconCode 선택 UI가 없어서 기본값 사용 (후속 UI에서 교체)
                    await assetPortfolioApi.createPortfolio({
                      name,
                      iconCode: "ICON_01",
                    });

                    await refetchGroups();
                    setNewFolderName("");
                    setIsCreateFolderOpen(false);
                  } catch {
                    setCreateFolderError("포트폴리오 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
                  } finally {
                    setIsCreatingFolder(false);
                  }
                }}
              />
            </div>

            {/* 탭 */}
            <div className="w-full border-b border-gray-300 flex">
              <button
                type="button"
                onClick={() => setTab("folder")}
                className={cn(
                  "px-5 py-2.5 text-Subtitle_L_Regular",
                  tab === "folder" ? "border-b-2 border-main-1 text-black" : "text-black"
                )}
              >
                포트폴리오별 보기
              </button>
              <button
                type="button"
                onClick={() => setTab("all")}
                className={cn(
                  "px-5 py-2.5 text-Subtitle_L_Regular",
                  tab === "all" ? "border-b-2 border-main-1 text-black" : "text-black"
                )}
              >
                전체 종목 보기
              </button>
            </div>

            {/* 테이블 */}
            <div className="w-full overflow-x-auto">
              <div className={cn("min-w-[820px]", !showFolderColumn && "min-w-[700px]")}>
                <div
                  className={cn(
                    "grid items-center h-14 border-b border-gray-200 text-Subtitle_L_Medium text-[#4A5565]",
                    showFolderColumn
                      ? "grid-cols-[1.2fr_0.6fr_0.6fr_1fr_0.8fr]"
                      : "grid-cols-[1.2fr_0.6fr_0.6fr_0.8fr]"
                  )}
                >
                  <div className="px-5">종목명</div>
                  <div className="px-5">보유수량</div>
                  <div className="text-center">현재가</div>
                  {showFolderColumn && <div className="px-5">현재 포트폴리오</div>}
                  <div className="px-5">관리</div>
                </div>

                {[
                  ...rows,
                ].map((row) => {
                  const currentFolder = row.folderId ? folderById.get(row.folderId) : null;
                  return (
                  <div
                    key={row.name}
                    className={cn(
                      "grid items-center h-20 border-b border-gray-100",
                      showFolderColumn
                        ? "grid-cols-[1.2fr_0.6fr_0.6fr_1fr_0.8fr]"
                        : "grid-cols-[1.2fr_0.6fr_0.6fr_0.8fr]"
                    )}
                  >
                    <div className="px-5 text-Subtitle_M_Regular text-[#101828]">{row.name}</div>
                    <div className="px-5 text-Subtitle_M_Regular text-[#364153]">{row.qty}</div>
                    <div className="text-right pr-6 text-Subtitle_M_Regular text-[#364153]">{row.price}</div>
                    {showFolderColumn && currentFolder && (
                      <div className="px-5">
                        <FolderChip folder={currentFolder} />
                      </div>
                    )}
                    <div className="px-5 flex items-center gap-3">
                      <div className="relative">
                        <button
                          type="button"
                          className="border border-gray-200 rounded-lg px-5 py-3 text-[14px] leading-5 text-gray-300"
                          onClick={() => {
                            setMovePendingFolderId(row.folderId);
                            setOpenMoveRowId((prev) => (prev === row.id ? null : row.id));
                          }}
                        >
                          이동
                        </button>
                        <MoveToFolderPopover
                          isOpen={openMoveRowId === row.id}
                          options={groupsForUi}
                          pendingId={movePendingFolderId}
                          onPendingChange={setMovePendingFolderId}
                          onClose={() => setOpenMoveRowId(null)}
                          onConfirm={() => {
                            if (movePendingFolderId == null) return;
                            setRows((prev) =>
                              prev.map((r) =>
                                r.id === row.id ? { ...r, folderId: movePendingFolderId } : r
                              )
                            );
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="bg-main-1 text-white rounded-lg px-5 py-3 text-[14px] leading-5"
                        onClick={() => {
                          // 해당 종목의 투자 시뮬레이터 화면으로 이동
                          navigate(`/simulation/${row.stockId}`, {
                            state: {
                              stockName: row.name,
                              stockCode: String(row.stockId),
                            },
                          });
                        }}
                      >
                        매수 / 매도
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyPortfolioManagementPage;


