import { useNavigate } from "react-router-dom";
import { useStockCandles } from "@/hooks/useMarketQueries";
import AreaChart from "./AreaChart";

interface ThemeStockChartProps {
  stockId: number;
  stockName: string;
}

const ThemeStockChart = ({ stockId, stockName }: ThemeStockChartProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useStockCandles(stockId, "일봉");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h4 className="text-[14px] font-medium text-black">
          {stockName} 1일 봉 차트
        </h4>
        <button
          onClick={() => navigate(`/simulation/${stockId}`)}
          className="text-[12px] text-[#42d6ba] hover:underline"
        >
          클릭하여 거래하기 →
        </button>
      </div>
      <div className="w-full border-y border-gray-200">
        {isLoading ? (
          <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
            차트 로딩중...
          </div>
        ) : data && data.length > 0 ? (
          <AreaChart data={data} height={250} />
        ) : (
          <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
            차트 데이터 없음
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeStockChart;
