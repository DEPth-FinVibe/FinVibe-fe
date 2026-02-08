import { StockChartHeader } from "@/components";
import { useIndexCandles } from "@/hooks/useMarketQueries";
import type { IndexType } from "@/api/market";
import MiniSparkline from "@/components/TradingVolumeRank/MiniSparkline";
import { cn } from "@/utils/cn";

const INDEX_LABELS: Record<IndexType, string> = {
  KOSPI: "코스피종합",
  KOSDAQ: "코스닥",
};

interface IndexHeaderItemProps {
  indexType: IndexType;
}

const IndexHeaderItem = ({ indexType }: IndexHeaderItemProps) => {
  const { data, isLoading } = useIndexCandles(indexType);
  const wrapperClassName = cn(
    "w-full px-1 py-2",
    indexType === "KOSPI" && "md:border-r md:border-gray-200 md:pr-5",
    indexType === "KOSDAQ" && "md:pl-5",
  );

  const formatValue = (v: number) =>
    v.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatChange = (v: number) => {
    const sign = v >= 0 ? "+" : "";
    return `${sign}${v.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatRate = (v: number) => {
    const sign = v >= 0 ? "+" : "";
    return `${sign}${v.toFixed(2)}%`;
  };

  if (isLoading || !data) {
    return (
      <article className={wrapperClassName}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-[0.06em] text-gray-500">
            {indexType}
          </span>
          <span className="text-[12px] text-gray-400">지수 로딩중</span>
        </div>
        <StockChartHeader
          indexName={INDEX_LABELS[indexType]}
          currentValue="--"
          changeAmount="--"
          changeRate="+0.00%"
        />
      </article>
    );
  }

  const isPositive = data.changeRate >= 0;

  return (
    <article className={wrapperClassName}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.06em] text-gray-500">
          {indexType}
        </span>
        <span
          className={cn(
            "text-[11px] font-semibold",
            isPositive ? "text-etc-red" : "text-etc-blue",
          )}
        >
          {isPositive ? "상승 흐름" : "하락 흐름"}
        </span>
      </div>

      <StockChartHeader
        indexName={INDEX_LABELS[indexType]}
        currentValue={formatValue(data.currentValue)}
        changeAmount={formatChange(data.changeAmount)}
        changeRate={formatRate(data.changeRate)}
        chart={
          <MiniSparkline
            values={data.sparklineValues}
            color={isPositive ? "#FF0000" : "#001AFF"}
            className="h-[33px] w-[58px]"
            ariaLabel={`${INDEX_LABELS[indexType]} 스파크라인`}
          />
        }
      />
    </article>
  );
};

export default IndexHeaderItem;
