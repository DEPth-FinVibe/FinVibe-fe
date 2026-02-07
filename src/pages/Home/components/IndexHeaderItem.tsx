import { StockChartHeader } from "@/components";
import { useIndexCandles } from "@/hooks/useMarketQueries";
import type { IndexType } from "@/api/market";

const INDEX_LABELS: Record<IndexType, string> = {
  KOSPI: "코스피종합",
  KOSDAQ: "코스닥",
};

interface IndexHeaderItemProps {
  indexType: IndexType;
}

const IndexHeaderItem = ({ indexType }: IndexHeaderItemProps) => {
  const { data, isLoading } = useIndexCandles(indexType);

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
      <StockChartHeader
        indexName={INDEX_LABELS[indexType]}
        currentValue="--"
        changeAmount="--"
        changeRate="+0.00%"
        className="flex justify-center items-center"
      />
    );
  }

  return (
    <StockChartHeader
      indexName={INDEX_LABELS[indexType]}
      currentValue={formatValue(data.currentValue)}
      changeAmount={formatChange(data.changeAmount)}
      changeRate={formatRate(data.changeRate)}
      className="flex justify-center items-center"
    />
  );
};

export default IndexHeaderItem;
