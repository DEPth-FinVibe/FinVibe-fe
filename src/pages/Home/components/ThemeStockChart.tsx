import { useNavigate } from "react-router-dom";
import { useStockCandles } from "@/hooks/useMarketQueries";
import AreaChart from "./AreaChart";

interface ThemeStockChartProps {
  stockId: number;
  stockName: string;
}

export const ThemeStockChartSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-4 w-40 bg-gray-200 rounded" />
      <div className="h-3 w-28 bg-gray-200 rounded" />
    </div>
    <div className="w-full border-y border-gray-200 h-[250px] relative overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-between py-8 px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full h-[1px] bg-gray-100" />
        ))}
      </div>
      <div className="absolute bottom-6 left-4 right-4 h-[60%]">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
          <path
            d="M0,80 C30,75 60,60 100,55 C140,50 170,65 200,45 C230,25 260,35 300,30 C340,25 370,15 400,20"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  </div>
);

const ThemeStockChart = ({ stockId, stockName }: ThemeStockChartProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useStockCandles(stockId, "일봉");

  if (isLoading) return <ThemeStockChartSkeleton />;

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
        {data && data.length > 0 ? (
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
