import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { walletApi } from "@/api/wallet";
import { useCreateTrade } from "@/hooks/useTradeQueries";
import type { TransactionRequest } from "@/api/trade";

interface OrderBookItem {
  price: number;
  volume: string;
}

interface OrderPanelProps {
  currentPrice: number;
  askOrders: OrderBookItem[]; // 매도 호가 (위쪽)
  bidOrders: OrderBookItem[]; // 매수 호가 (아래쪽)
  stockId: number;
  portfolioId: number | null;
  onTradeSuccess?: () => void;
}

type OrderType = "지정가" | "시장가" | "예약";
type TradeType = "buy" | "sell";

const OrderPanel = ({
  currentPrice,
  askOrders,
  bidOrders,
  stockId,
  portfolioId,
  onTradeSuccess,
}: OrderPanelProps) => {
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [orderType, setOrderType] = useState<OrderType>("지정가");
  const [price, setPrice] = useState(currentPrice);
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const createTrade = useCreateTrade();

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

  // 현재가 변경 시 주문 가격 업데이트 (지정가일 때만)
  useEffect(() => {
    if (orderType === "시장가" && currentPrice > 0) {
      setPrice(currentPrice);
    }
  }, [currentPrice, orderType]);

  const handlePriceChange = (delta: number) => {
    setPrice((prev) => Math.max(0, prev + delta));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  // 현재가 버튼 클릭 시
  const handleSetCurrentPrice = () => {
    setPrice(currentPrice);
  };

  // +1% / -1% 버튼
  const handlePricePercent = (percent: number) => {
    setPrice(Math.round(currentPrice * (1 + percent / 100)));
  };

  // 퍼센트 버튼으로 수량 설정 (잔액 기준)
  const handlePercentQuantity = (percent: number) => {
    if (balance == null || price <= 0) return;
    const maxQuantity = Math.floor((balance * percent) / 100 / price);
    setQuantity(Math.max(1, maxQuantity));
  };

  // 주문 실행
  const handleOrder = async () => {
    if (!portfolioId || !stockId || price <= 0 || quantity <= 0) {
      setOrderStatus({ type: "error", message: "주문 정보를 확인해주세요." });
      return;
    }

    // 매수 시 잔액 체크
    if (tradeType === "buy" && balance != null) {
      const totalCost = price * quantity;
      if (totalCost > balance) {
        setOrderStatus({ type: "error", message: "잔액이 부족합니다." });
        return;
      }
    }

    const request: TransactionRequest = {
      stockId,
      amount: quantity,
      price,
      portfolioId,
      tradeType: orderType === "예약" ? "RESERVED" : "NORMAL",
      transactionType: tradeType === "buy" ? "BUY" : "SELL",
    };

    try {
      await createTrade.mutateAsync(request);
      setOrderStatus({
        type: "success",
        message: `${tradeType === "buy" ? "매수" : "매도"} 주문이 완료되었습니다.`,
      });
      // 잔액 갱신
      walletApi.getBalance().then((data) => {
        setBalance(Number.isFinite(data.balance) ? Math.max(0, data.balance) : 0);
      });
      onTradeSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "주문에 실패했습니다.";
      setOrderStatus({ type: "error", message });
    }
  };

  // 상태 메시지 자동 숨김
  useEffect(() => {
    if (orderStatus) {
      const timer = setTimeout(() => setOrderStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  const totalAmount = price * quantity;

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
            className="px-3 py-2 text-lg bg-main-1 text-white"
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
            className="px-3 py-2 text-lg bg-etc-red text-white"
          >
            +
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSetCurrentPrice}
            className="px-3 py-1 rounded text-Caption_L_Light bg-gray-100 hover:bg-gray-200"
          >
            현재가
          </button>
          <button
            onClick={() => handlePricePercent(1)}
            className="px-3 py-1 rounded text-Caption_L_Light bg-gray-100 hover:bg-gray-200"
          >
            +1%
          </button>
          <button
            onClick={() => handlePricePercent(-1)}
            className="px-3 py-1 rounded text-Caption_L_Light bg-gray-100 hover:bg-gray-200"
          >
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
            className="px-3 py-2 text-lg bg-main-1 text-white"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="flex-1 text-center py-2 text-Subtitle_S_Medium outline-none"
          />
          <span className="pr-2 text-Body_M_Light text-gray-400">주</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 text-lg bg-etc-red text-white"
          >
            +
          </button>
        </div>

        {/* 퍼센트 버튼 (잔액 기준) */}
        <div className="flex gap-2 flex-wrap">
          {[10, 25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => handlePercentQuantity(percent)}
              disabled={balance === null}
              className={cn(
                "px-3 py-1.5 rounded text-Caption_L_Light",
                balance === null
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              )}
            >
              {percent}%
            </button>
          ))}
        </div>

        {/* 수량 버튼 */}
        <div className="flex gap-2">
          {[10, 50, 100].map((qty) => (
            <button
              key={qty}
              onClick={() => setQuantity(qty)}
              className="px-3 py-1.5 rounded text-Caption_L_Light bg-gray-800 text-white hover:bg-gray-700"
            >
              {qty}주
            </button>
          ))}
        </div>
      </div>

      {/* 주문 금액 표시 */}
      <div className="flex justify-between items-center py-2 border-t border-gray-200">
        <span className="text-Body_M_Light text-gray-500">주문 총액</span>
        <span className="text-Subtitle_S_Medium">
          {totalAmount.toLocaleString()} 원
        </span>
      </div>

      {/* 상태 메시지 */}
      {orderStatus && (
        <div
          className={cn(
            "p-3 rounded-lg text-Body_M_Light text-center",
            orderStatus.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {orderStatus.message}
        </div>
      )}

      {/* 주문 실행 버튼 */}
      <button
        onClick={handleOrder}
        disabled={createTrade.isPending || !portfolioId}
        className={cn(
          "w-full py-4 rounded-lg text-Subtitle_S_Medium transition-colors",
          createTrade.isPending || !portfolioId
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : tradeType === "buy"
              ? "bg-etc-red text-white hover:bg-red-600"
              : "bg-etc-blue text-white hover:bg-blue-600"
        )}
      >
        {createTrade.isPending
          ? "주문 처리중..."
          : `${tradeType === "buy" ? "매수" : "매도"} 주문`}
      </button>
    </div>
  );
};

export default OrderPanel;
