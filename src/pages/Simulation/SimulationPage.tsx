import { useState, useMemo, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@/components/TextField";
import { StockListItem } from "@/components/StockListItem";
import SearchIcon from "@/assets/svgs/SearchIcon";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import FavoriteStarIcon from "@/assets/svgs/FavoriteStarIcon";
import { cn } from "@/utils/cn";
import {
  formatPriceWithSymbol,
  formatChangeRate,
  formatVolume,
} from "@/utils/formatStock";
import {
  useTopByVolumeWithPrices,
  useStockSearchWithPrices,
} from "@/hooks/useMarketQueries";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useMarketStore, useQuote } from "@/store/useMarketStore";
import { useMarketStatus } from "@/hooks/useMarketQueries";
import type { StockWithPrice } from "@/api/market";
import SimulationPortfolioTab from "@/pages/Simulation/components/SimulationPortfolioTab";
import { assetPortfolioApi, type PortfolioGroup } from "@/api/asset";
import { memberApi, type FavoriteStockResponse } from "@/api/member";
import { useAuthStore } from "@/store/useAuthStore";

type RightTab = "관심 종목" | "거래 종목" | "예약/자동 주문" | "포트폴리오";

const PAGE_SIZE = 20;

const DOMESTIC_CATEGORY_IDS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];


// 관심종목 카드 컴포넌트
interface WatchlistCardProps {
  stockName: string;
  stockCode: string;
  tradingVolume: string;
  price: string;
  changeRate: string;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
}

const WatchlistCard = ({
  stockName,
  stockCode,
  tradingVolume,
  price,
  changeRate,
  isFavorited = false,
  onFavoriteToggle,
  onClick,
}: WatchlistCardProps) => {
  const isPositive = changeRate.startsWith("+");
  const changeColor = isPositive ? "text-etc-red" : "text-etc-blue";
  const iconColor = isPositive ? "#FF0000" : "#001AFF";
  const iconDirection = isPositive ? "up" : "down";

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-lg",
        isFavorited ? "bg-sub-blue" : "border border-gray-200",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {onFavoriteToggle && (
        <div
          className="mr-3 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
        >
          <FavoriteStarIcon
            filled={isFavorited}
            className="w-5 h-[19px]"
            ariaLabel={isFavorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          />
        </div>
      )}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-Subtitle_S_Medium", isFavorited ? "text-white" : "text-sub-blue")}>
            {stockName}
          </span>
          <span className={cn("text-Caption_L_Light", isFavorited ? "text-gray-100" : "text-gray-400")}>
            {stockCode}
          </span>
        </div>
        <span className={cn("text-Caption_L_Light", isFavorited ? "text-gray-100" : "text-gray-400")}>
          {tradingVolume ? `거래량: ${tradingVolume}` : "거래량:"}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={cn("text-Body_M_Light", isFavorited ? "text-gray-100" : "text-gray-400")}>{price}</span>
        {changeRate && (
          <div className="flex items-center gap-1">
            <ChangeRateIcon
              className="w-4 h-4"
              color={iconColor}
              direction={iconDirection}
              ariaLabel="등락률"
            />
            <span className={cn("text-Body_M_Light", changeColor)}>
              {changeRate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// 실시간 가격 업데이트를 위한 래퍼 컴포넌트
interface RealTimeStockItemProps {
  stock: StockWithPrice;
  onClick: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

const RealTimeStockItem = memo(({ stock, onClick, isFavorited, onFavoriteToggle }: RealTimeStockItemProps) => {
  const quote = useQuote(stock.stockId);

  // 실시간 데이터가 있으면 사용, 없으면 REST API 데이터 사용
  const price = quote?.close ?? stock.close;
  const changePct = quote?.prevDayChangePct ?? stock.prevDayChangePct;
  const volume = quote?.volume ?? stock.volume;

  return (
    <StockListItem
      stockName={stock.name}
      stockCode={stock.symbol}
      tradingVolume={formatVolume(volume)}
      price={formatPriceWithSymbol(price)}
      changeRate={formatChangeRate(changePct)}
      onClick={onClick}
      isFavorited={isFavorited}
      onFavoriteToggle={onFavoriteToggle}
    />
  );
});

const SimulationPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [rightTab, setRightTab] = useState<RightTab>("관심 종목");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 관심 종목
  const [favoriteStocks, setFavoriteStocks] = useState<FavoriteStockResponse[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    memberApi.getFavoriteStocks(user.userId).then((data) => {
      if (!cancelled) setFavoriteStocks(data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [user]);

  const favoriteStockIds = useMemo(
    () => new Set(favoriteStocks.map((f) => f.stockId)),
    [favoriteStocks],
  );

  const handleFavoriteToggle = async (stockId: number, stockName: string) => {
    if (!user) return;
    const isFav = favoriteStockIds.has(stockId);
    try {
      if (isFav) {
        await memberApi.removeFavoriteStock(user.userId, stockId);
        setFavoriteStocks((prev) => prev.filter((f) => f.stockId !== stockId));
      } else {
        const added = await memberApi.addFavoriteStock(user.userId, stockId);
        setFavoriteStocks((prev) => [...prev, { ...added, name: added.name || stockName }]);
      }
    } catch {
      // 실패 시 무시
    }
  };

  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  const isSearchMode = debouncedQuery.length >= 1;

  const marketTypeParam = "DOMESTIC";
  const topByVolume = useTopByVolumeWithPrices();
  const searchResult = useStockSearchWithPrices(
    debouncedQuery,
    marketTypeParam,
  );

  const { subscribe, unsubscribe } = useMarketStore();
  const { isMarketOpen } = useMarketStatus();
  const [portfolioGroups, setPortfolioGroups] = useState<
    PortfolioGroup[] | null
  >(null);
  const [isCreatingPortfolioGroup, setIsCreatingPortfolioGroup] =
    useState(false);
  const [createPortfolioGroupError, setCreatePortfolioGroupError] = useState<
    string | null
  >(null);
  const [isUpdatingPortfolioGroup, setIsUpdatingPortfolioGroup] =
    useState(false);
  const [updatingPortfolioGroupId, setUpdatingPortfolioGroupId] = useState<
    number | null
  >(null);
  const [updatePortfolioGroupError, setUpdatePortfolioGroupError] = useState<
    string | null
  >(null);
  const [isDeletingPortfolioGroup, setIsDeletingPortfolioGroup] =
    useState(false);
  const [deletingPortfolioGroupId, setDeletingPortfolioGroupId] = useState<
    number | null
  >(null);
  const [deletePortfolioGroupError, setDeletePortfolioGroupError] = useState<
    string | null
  >(null);

  const rightTabs: RightTab[] = [
    "관심 종목",
    "거래 종목",
    "예약/자동 주문",
    "포트폴리오",
  ];

  const filteredStocks = useMemo(() => {
    const sourceData = isSearchMode ? searchResult.data : topByVolume.data;
    if (!sourceData) return [];

    return sourceData.filter((stock: StockWithPrice) =>
      DOMESTIC_CATEGORY_IDS.includes(stock.categoryId),
    );
  }, [isSearchMode, searchResult.data, topByVolume.data]);

  const visibleStocks = useMemo(
    () => filteredStocks.slice(0, visibleCount),
    [filteredStocks, visibleCount],
  );

  const hasMore = visibleCount < filteredStocks.length;
  const isLoading = isSearchMode
    ? searchResult.isLoading
    : topByVolume.isLoading;

  // 장 열림 시에만 화면에 보이는 종목들 웹소켓 구독
  useEffect(() => {
    if (!isMarketOpen) return;
    const stockIds = visibleStocks.map((s) => s.stockId);
    if (stockIds.length > 0) {
      subscribe(stockIds);
    }
    return () => {
      if (stockIds.length > 0) {
        unsubscribe(stockIds);
      }
    };
  }, [visibleStocks, isMarketOpen, subscribe, unsubscribe]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);

    
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    setVisibleCount(PAGE_SIZE);
  };

  const fetchPortfolioGroups = async (opts?: { showLoading?: boolean }) => {
    if (opts?.showLoading) setPortfolioGroups(null);
    const groups = await assetPortfolioApi.getPortfolios();
    setPortfolioGroups(Array.isArray(groups) ? groups : []);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const groups = await assetPortfolioApi.getPortfolios();
        if (!alive) return;
        setPortfolioGroups(Array.isArray(groups) ? groups : []);
      } catch {
        if (!alive) return;
        setPortfolioGroups([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleCreatePortfolioGroup = async (name: string) => {
    setCreatePortfolioGroupError(null);
    setIsCreatingPortfolioGroup(true);
    try {
      // NOTE: 아이콘 선택 UI는 아직 없어서 기본값 사용 (후속 단계에서 교체)
      await assetPortfolioApi.createPortfolio({ name, iconCode: "ICON_01" });
      await fetchPortfolioGroups({ showLoading: true });
    } catch (e) {
      setCreatePortfolioGroupError(
        "폴더 생성에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
      throw e;
    } finally {
      setIsCreatingPortfolioGroup(false);
    }
  };

  const handleUpdatePortfolioGroupName = async (
    groupId: number,
    name: string,
  ) => {
    setUpdatePortfolioGroupError(null);
    setIsUpdatingPortfolioGroup(true);
    setUpdatingPortfolioGroupId(groupId);

    const current = (portfolioGroups ?? []).find((g) => g.id === groupId);
    const iconCode = current?.iconCode ?? "ICON_01";

    try {
      await assetPortfolioApi.updatePortfolio(groupId, { name, iconCode });
      await fetchPortfolioGroups({ showLoading: true });
      setUpdatingPortfolioGroupId(null);
    } catch (e) {
      setUpdatePortfolioGroupError(
        "폴더명 수정에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
      throw e;
    } finally {
      setIsUpdatingPortfolioGroup(false);
    }
  };

  const handleDeletePortfolioGroup = async (groupId: number) => {
    setDeletePortfolioGroupError(null);
    setIsDeletingPortfolioGroup(true);
    setDeletingPortfolioGroupId(groupId);
    try {
      await assetPortfolioApi.deletePortfolio(groupId);
      await fetchPortfolioGroups({ showLoading: true });
      setDeletingPortfolioGroupId(null);
    } catch (e) {
      setDeletePortfolioGroupError(
        "폴더 삭제에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
      throw e;
    } finally {
      setIsDeletingPortfolioGroup(false);
    }
  };

  return (
    <div className="bg-white h-[calc(100vh-64px)] overflow-hidden">
      <main className="flex px-32 py-6 gap-20 h-full">
        {/* 왼쪽 패널 - 주식 검색 및 리스트 */}
        <section className="flex-1 flex flex-col min-h-0">
          {/* 검색창 */}
          <TextField
            placeholder="종목명 또는 코드 검색"
            size="medium"
            leftIcon={<SearchIcon className="w-5 h-5 text-gray-400" />}
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-6 shrink-0"
            inputClassName="bg-gray-100 rounded-lg"
          />

          {/* 주식 리스트 - 스크롤 영역 */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-2">
            {isLoading && (
              <div className="flex justify-center items-center py-10 text-gray-400 text-sm">
                로딩중...
              </div>
            )}
            {!isLoading && visibleStocks.length === 0 && (
              <div className="flex justify-center items-center py-10 text-gray-400 text-sm">
                {isSearchMode
                  ? "검색 결과가 없습니다."
                  : "종목 데이터를 불러올 수 없습니다."}
              </div>
            )}
            {!isLoading &&
              visibleStocks.map((stock: StockWithPrice) => (
                <RealTimeStockItem
                  key={stock.stockId}
                  stock={stock}
                  onClick={() => navigate(`/simulation/${stock.stockId}`, {
                    state: {
                      stockName: stock.name,
                      stockCode: stock.symbol,
                    },
                  })}
                  isFavorited={favoriteStockIds.has(stock.stockId)}
                  onFavoriteToggle={() => handleFavoriteToggle(stock.stockId, stock.name)}
                />
              ))}
            {!isLoading && hasMore && (
              <button
                onClick={handleShowMore}
                className="w-full py-3 text-sm text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                더 보기
              </button>
            )}
          </div>
        </section>

        {/* 오른쪽 패널 - 관심 종목 등 */}
        <aside className="shrink-0 flex flex-col min-h-0">
          {/* 상단 탭 */}
          <div className="flex border-b border-gray-200 mb-4">
            {rightTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={cn(
                  "px-4 py-3 text-Subtitle_S_Medium transition-colors whitespace-nowrap",
                  rightTab === tab
                    ? "text-black border-b-2 border-main-1"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {rightTab === "포트폴리오" ? (
            <SimulationPortfolioTab
              groups={portfolioGroups ?? []}
              isLoading={portfolioGroups === null}
              isCreating={isCreatingPortfolioGroup}
              createErrorMessage={createPortfolioGroupError}
              onSubmitCreateFolder={handleCreatePortfolioGroup}
              isUpdating={isUpdatingPortfolioGroup}
              updatingGroupId={updatingPortfolioGroupId}
              updateErrorMessage={updatePortfolioGroupError}
              onSubmitUpdateGroupName={handleUpdatePortfolioGroupName}
              isDeleting={isDeletingPortfolioGroup}
              deletingGroupId={deletingPortfolioGroupId}
              deleteErrorMessage={deletePortfolioGroupError}
              onDeleteGroup={handleDeletePortfolioGroup}
            />
          ) : (
            <>
              {/* 관심 종목 리스트 - 스크롤 영역 */}
              <div className="flex flex-col gap-3 overflow-y-auto flex-1">
                {favoriteStocks.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-Body_M_Light">
                    관심 종목이 없습니다
                  </p>
                ) : (
                  favoriteStocks.map((item) => (
                    <WatchlistCard
                      key={item.stockId}
                      stockName={item.name}
                      stockCode={String(item.stockId)}
                      tradingVolume=""
                      price=""
                      changeRate=""
                      isFavorited
                      onFavoriteToggle={() => handleFavoriteToggle(item.stockId, item.name)}
                      onClick={() => navigate(`/simulation/${item.stockId}`, {
                        state: {
                          stockName: item.name,
                          stockCode: String(item.stockId),
                        },
                      })}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
};

export default SimulationPage;
