import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { walletApi } from "@/api/wallet";

interface OrderBookItem {
  price: number;
  volume: string;
}

interface OrderPanelProps {
  currentPrice: number;
  askOrders: OrderBookItem[]; // 매도 호가 (위쪽)
  bidOrders: OrderBookItem[]; // 매수 호가 (아래쪽)
}

type OrderType = "지정가" | "시장가" | "예약";
type TradeType = "buy" | "sell";

const OrderPanel = ({ currentPrice, askOrders, bidOrders }: OrderPanelProps) => {
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [orderType, setOrderType] = useState<OrderType>("지정가");
  const [price, setPrice] = useState(currentPrice);
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState<number | null>(null);

  // 보유잔액 api
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await walletApi.getBalance();
        if (!alive) return;
        setBalance(Number.isFinite(data.balance) ? Math.max(0, data.balance) : 0);
      } catch {
        // 실패 시 로딩 표시 유지
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const percentButtons = ["10%", "25%", "50%", "75%", "100%"];
  const quantityButtons = ["10주", "50주", "100주"];

  const handlePriceChange = (delta: number) => {
    setPrice((prev) => Math.max(0, prev + delta));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 매수/매도 탭 */}
      <div className="flex gap-2">
        <button
          onClick={() => setTradeType("buy")}
          className={cn(
            "flex-1 py-3 rounded-lg text-Subtitle_S_Medium transition-colors",
            tradeType === "buy"
              ? "bg-etc-red text-white"
              : "bg-gray-100 text-gray-400"
          )}
        >
          매수
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={cn(
            "flex-1 py-3 rounded-lg text-Subtitle_S_Medium transition-colors",
            tradeType === "sell"
              ? "bg-etc-blue text-white"
              : "bg-gray-100 text-gray-400"
          )}
        >
          매도
        </button>
      </div>

      {/* 호가 테이블 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-Subtitle_S_Medium mb-3">호가</p>

        {/* 매도 호가 (위쪽 - 파란색) */}
        <div className="flex flex-col gap-1 mb-2">
          {askOrders.map((order, idx) => (
            <div key={`ask-${idx}`} className="flex justify-between text-Body_M_Light">
              <span className="text-gray-500">{order.volume}</span>
              <span className="text-etc-blue">{order.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* 매수/매도 버튼 + 현재가 */}
        <div className="flex items-center gap-2 py-2 border-y border-gray-200 my-2">
          <button
            className={cn(
              "flex-1 py-2 rounded text-Body_M_Light",
              "bg-etc-red text-white"
            )}
          >
            매수
          </button>
          <span className="text-Subtitle_S_Medium px-2">
            {currentPrice.toLocaleString()}
          </span>
          <button
            className={cn(
              "flex-1 py-2 rounded text-Body_M_Light",
              "bg-gray-200 text-gray-600"
            )}
          >
            매도
          </button>
          <button className="p-1 text-gray-400">✕</button>
        </div>

        {/* 현재가 표시 */}
        <div className="flex justify-between text-Body_M_Light mb-2">
          <span className="text-gray-500">현재가</span>
          <span className="text-etc-red">{currentPrice.toLocaleString()}</span>
        </div>

        {/* 매수 호가 (아래쪽 - 빨간색) */}
        <div className="flex flex-col gap-1">
          {bidOrders.map((order, idx) => (
            <div key={`bid-${idx}`} className="flex justify-between text-Body_M_Light">
              <span className="text-etc-red">{order.price.toLocaleString()}</span>
              <span className="text-gray-500">{order.volume}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 주문 유형 선택 */}
      <div className="flex gap-4">
        {(["지정가", "시장가", "예약"] as OrderType[]).map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="orderType"
              checked={orderType === type}
              onChange={() => setOrderType(type)}
              className="w-4 h-4 accent-main-1"
            />
            <span className="text-Body_M_Light">{type}</span>
          </label>
        ))}
      </div>

      {/* 보유 잔액 */}
      <div className="flex justify-between items-center">
        <span className="text-Body_M_Light text-gray-500">보유 잔액</span>
        <div className="bg-gray-100 px-4 py-2 rounded-lg text-Body_M_Light text-gray-400">
          {balance === null ? "-" : balance.toLocaleString()} KRW
        </div>
      </div>

      {/* 주문 가격 */}
      <div className="flex flex-col gap-2">
        <span className="text-Body_M_Light">주문 가격</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => handlePriceChange(-100)}
            className="px-3 py-2 bg-main-1 text-white text-lg"
          >
            −
          </button>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="flex-1 text-center py-2 text-Subtitle_S_Medium outline-none"
          />
          <span className="pr-2 text-Body_M_Light text-gray-400">원</span>
          <button
            onClick={() => handlePriceChange(100)}
            className="px-3 py-2 bg-etc-red text-white text-lg"
          >
            +
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-gray-100 rounded text-Caption_L_Light">
            현재가
          </button>
          <button className="px-3 py-1 bg-gray-100 rounded text-Caption_L_Light">
            +1%
          </button>
          <button className="px-3 py-1 bg-gray-100 rounded text-Caption_L_Light">
            -1%
          </button>
        </div>
      </div>

      {/* 수량 */}
      <div className="flex flex-col gap-2">
        <span className="text-Body_M_Light">수량</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 bg-main-1 text-white text-lg"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="flex-1 text-center py-2 text-Subtitle_S_Medium outline-none"
          />
          <span className="pr-2 text-Body_M_Light text-gray-400">주</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 bg-etc-red text-white text-lg"
          >
            +
          </button>
        </div>

        {/* 퍼센트 버튼 */}
        <div className="flex gap-2 flex-wrap">
          {percentButtons.map((btn) => (
            <button
              key={btn}
              className="px-3 py-1.5 bg-gray-800 text-white rounded text-Caption_L_Light"
            >
              {btn}
            </button>
          ))}
        </div>

        {/* 수량 버튼 */}
        <div className="flex gap-2">
          {quantityButtons.map((btn) => (
            <button
              key={btn}
              className="px-3 py-1.5 bg-gray-800 text-white rounded text-Caption_L_Light"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
