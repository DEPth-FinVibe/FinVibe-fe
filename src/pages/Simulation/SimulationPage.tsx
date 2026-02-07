import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@/components/TextField";
import { StockListItem } from "@/components/StockListItem";
import Chip from "@/components/Chip/Chip";
import SearchIcon from "@/assets/svgs/SearchIcon";
import ChangeRateIcon from "@/assets/svgs/ChangeRateIcon";
import { cn } from "@/utils/cn";
import SimulationPortfolioTab from "@/pages/Simulation/components/SimulationPortfolioTab";
import { assetPortfolioApi, type PortfolioGroup } from "@/api/asset";

type MarketFilter = "전체" | "국내" | "해외";
type RightTab = "관심 종목" | "거래 종목" | "예약/자동 주문" | "포트폴리오";

// Mock 데이터
const MOCK_STOCKS = [
  {
    id: 1,
    stockName: "삼성전자",
    stockCode: "005930",
    tradingVolume: "12.5M",
    price: "₩70,542",
    changeRate: "+2.23%",
    isFavorited: true,
  },
  {
    id: 2,
    stockName: "SK하이닉스",
    stockCode: "000660",
    tradingVolume: "8.2M",
    price: "₩186,500",
    changeRate: "+1.85%",
    isFavorited: false,
  },
  {
    id: 3,
    stockName: "LG에너지솔루션",
    stockCode: "373220",
    tradingVolume: "1.2M",
    price: "₩412,000",
    changeRate: "-0.72%",
    isFavorited: false,
  },
  {
    id: 4,
    stockName: "현대차",
    stockCode: "005380",
    tradingVolume: "3.4M",
    price: "₩234,500",
    changeRate: "+0.85%",
    isFavorited: false,
  },
  {
    id: 5,
    stockName: "카카오",
    stockCode: "035720",
    tradingVolume: "5.6M",
    price: "₩45,600",
    changeRate: "+1.12%",
    isFavorited: false,
  },
  {
    id: 6,
    stockName: "NAVER",
    stockCode: "035420",
    tradingVolume: "2.1M",
    price: "₩178,000",
    changeRate: "-0.56%",
    isFavorited: false,
  },
  {
    id: 7,
    stockName: "셀트리온",
    stockCode: "068270",
    tradingVolume: "1.8M",
    price: "₩192,300",
    changeRate: "+0.94%",
    isFavorited: false,
  },
];

const MOCK_WATCHLIST = [
  {
    id: 1,
    stockName: "삼성전자",
    stockCode: "005930",
    tradingVolume: "12.5M",
    price: "₩70,542",
    changeRate: "+2.23%",
  },
  {
    id: 2,
    stockName: "종목명",
    stockCode: "종목코드",
    tradingVolume: "",
    price: "₩실시간 가격",
    changeRate: "-변화율",
  },
];

// 왼쪽 패널 마켓 필터 (버튼 스타일 - 크고 rounded 작음)
interface MarketFilterTabsProps {
  value: MarketFilter;
  onChange: (filter: MarketFilter) => void;
}

const LeftMarketFilterTabs = ({ value, onChange }: MarketFilterTabsProps) => {
  const filters: MarketFilter[] = ["전체", "국내", "해외"];

  return (
    <div className="flex gap-3">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={cn(
            "px-8 py-2.5 rounded-lg text-Body_L_Regular transition-colors",
            value === filter
              ? "bg-main-1 text-white"
              : "bg-white text-black border border-gray-300"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

// 오른쪽 패널 마켓 필터 (Chip 스타일 - 작고 rounded 큼)
const RightMarketFilterTabs = ({ value, onChange }: MarketFilterTabsProps) => {
  const filters: MarketFilter[] = ["전체", "국내", "해외"];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Chip
          key={filter}
          label={filter}
          variant="default"
          onClick={() => onChange(filter)}
          className={cn(
            "px-4 py-1.5 rounded-[20px]",
            value === filter
              ? "bg-main-1 text-white border-main-1"
              : "bg-white text-black border-gray-300"
          )}
        />
      ))}
    </div>
  );
};

// 관심종목 카드 컴포넌트
interface WatchlistCardProps {
  stockName: string;
  stockCode: string;
  tradingVolume: string;
  price: string;
  changeRate: string;
}

const WatchlistCard = ({
  stockName,
  stockCode,
  tradingVolume,
  price,
  changeRate,
}: WatchlistCardProps) => {
  const isPositive = changeRate.startsWith("+");
  const changeColor = isPositive ? "text-etc-red" : "text-etc-blue";
  const iconColor = isPositive ? "#FF0000" : "#001AFF";
  const iconDirection = isPositive ? "up" : "down";

  return (
    <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-Subtitle_S_Medium text-sub-blue">{stockName}</span>
          <span className="text-Caption_L_Light text-gray-400">{stockCode}</span>
        </div>
        <span className="text-Caption_L_Light text-gray-400">
          {tradingVolume ? `거래량: ${tradingVolume}` : "거래량:"}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-Body_M_Light text-gray-400">{price}</span>
        <div className="flex items-center gap-1">
          <ChangeRateIcon
            className="w-4 h-4"
            color={iconColor}
            direction={iconDirection}
            ariaLabel="등락률"
          />
          <span className={cn("text-Body_M_Light", changeColor)}>{changeRate}</span>
        </div>
      </div>
    </div>
  );
};

const SimulationPage = () => {
  const navigate = useNavigate();
  const [leftMarketFilter, setLeftMarketFilter] = useState<MarketFilter>("전체");
  const [rightMarketFilter, setRightMarketFilter] = useState<MarketFilter>("전체");
  const [rightTab, setRightTab] = useState<RightTab>("관심 종목");
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [portfolioGroups, setPortfolioGroups] = useState<PortfolioGroup[] | null>(null);
  const [isCreatingPortfolioGroup, setIsCreatingPortfolioGroup] = useState(false);
  const [createPortfolioGroupError, setCreatePortfolioGroupError] = useState<string | null>(null);
  const [isUpdatingPortfolioGroup, setIsUpdatingPortfolioGroup] = useState(false);
  const [updatingPortfolioGroupId, setUpdatingPortfolioGroupId] = useState<number | null>(null);
  const [updatePortfolioGroupError, setUpdatePortfolioGroupError] = useState<string | null>(null);
  const [isDeletingPortfolioGroup, setIsDeletingPortfolioGroup] = useState(false);
  const [deletingPortfolioGroupId, setDeletingPortfolioGroupId] = useState<number | null>(null);
  const [deletePortfolioGroupError, setDeletePortfolioGroupError] = useState<string | null>(null);

  const rightTabs: RightTab[] = ["관심 종목", "거래 종목", "예약/자동 주문", "포트폴리오"];

  const handleFavoriteToggle = (id: number) => {
    setStocks((prev) =>
      prev.map((stock) =>
        stock.id === id ? { ...stock, isFavorited: !stock.isFavorited } : stock
      )
    );
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
      setCreatePortfolioGroupError("폴더 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
      throw e;
    } finally {
      setIsCreatingPortfolioGroup(false);
    }
  };

  const handleUpdatePortfolioGroupName = async (groupId: number, name: string) => {
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
      setUpdatePortfolioGroupError("폴더명 수정에 실패했어요. 잠시 후 다시 시도해주세요.");
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
      setDeletePortfolioGroupError("폴더 삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
      throw e;
    } finally {
      setIsDeletingPortfolioGroup(false);
    }
  };

  return (
    <div className="bg-white ">
      <main className="flex px-32 py-6 gap-20">
        {/* 왼쪽 패널 - 주식 검색 및 리스트 */}
        <section className="flex-1">
          {/* 마켓 필터 탭 */}
          <div className="mb-6">
            <LeftMarketFilterTabs value={leftMarketFilter} onChange={setLeftMarketFilter} />
          </div>

          {/* 검색창 */}
          <TextField
            placeholder="종목명 또는 코드 검색"
            size="medium"
            leftIcon={<SearchIcon className="w-5 h-5 text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-6"
            inputClassName="bg-gray-100 rounded-lg"
          />

          {/* 주식 리스트 */}
          <div className="flex flex-col gap-4">
            {stocks.map((stock) => (
              <StockListItem
                key={stock.id}
                stockName={stock.stockName}
                stockCode={stock.stockCode}
                tradingVolume={stock.tradingVolume}
                price={stock.price}
                changeRate={stock.changeRate}
                isFavorited={stock.isFavorited}
                onFavoriteToggle={() => handleFavoriteToggle(stock.id)}
                onClick={() => navigate(`/simulation/${stock.stockCode}`)}
              />
            ))}
          </div>
        </section>

        {/* 오른쪽 패널 - 관심 종목 등 */}
        <aside className="shrink-0">
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
                    : "text-gray-400 hover:text-gray-600"
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
              {/* 서브 필터 탭 */}
              <div className="mb-4">
                <RightMarketFilterTabs
                  value={rightMarketFilter}
                  onChange={setRightMarketFilter}
                />
              </div>

              {/* 관심 종목 리스트 */}
              <div className="flex flex-col gap-3">
                {MOCK_WATCHLIST.map((item) => (
                  <WatchlistCard
                    key={item.id}
                    stockName={item.stockName}
                    stockCode={item.stockCode}
                    tradingVolume={item.tradingVolume}
                    price={item.price}
                    changeRate={item.changeRate}
                  />
                ))}
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
};

export default SimulationPage;
