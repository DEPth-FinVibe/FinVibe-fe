import { assetPortfolioApi, type PortfolioGroup } from "@/api/asset/portfolio";
import type { TransactionRequest } from "@/api/trade";
import { walletApi } from "@/api/wallet";
import ChevronIcon from "@/assets/svgs/ChevronIcon";
import { useCreateTrade } from "@/hooks/useTradeQueries";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface OrderPanelProps {
  currentPrice: number;
  stockId: number;
  stockName: string;
  currency?: "USD" | "KRW";
  onTradeSuccess?: () => void;
}

type OrderType = "지정가" | "시장가" | "예약";
type TradeType = "buy" | "sell";

const OrderPanel = ({
  currentPrice,
  stockId,
  onTradeSuccess,
}: OrderPanelProps) => {
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [orderType, setOrderType] = useState<OrderType>("지정가");
  const [price, setPrice] = useState(currentPrice);
  const [quantity, setQuantity] = useState(1);
  const [balance, setBalance] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 포트폴리오 관리
  const [portfolios, setPortfolios] = useState<PortfolioGroup[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(
    null,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const createTrade = useCreateTrade();

  // 보유잔액 api
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await walletApi.getBalance();
        if (!alive) return;
        setBalance(
          Number.isFinite(data.balance) ? Math.max(0, data.balance) : 0,
        );
      } catch {
        // 실패 시 로딩 표시 유지
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 포트폴리오 목록 조회
  useEffect(() => {
    let cancelled = false;
    assetPortfolioApi
      .getPortfolios()
      .then((data) => {
        if (!cancelled) {
          setPortfolios(data);
          // 첫 번째 포트폴리오를 기본 선택
          if (data.length > 0) {
            setSelectedPortfolioId(data[0].id);
          }
        }
      })
      .catch(() => {
        // 실패 시 무시
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
    if (!selectedPortfolioId || !stockId || price <= 0 || quantity <= 0) {
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
      portfolioId: selectedPortfolioId,
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
        setBalance(
          Number.isFinite(data.balance) ? Math.max(0, data.balance) : 0,
        );
      });
      onTradeSuccess?.();
    } catch (error) {
      let message = "주문에 실패했습니다.";

      if (axios.isAxiosError(error)) {
        // API 에러 응답에서 메시지 추출
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

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
              : "bg-gray-100 text-gray-400",
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
              : "bg-gray-100 text-gray-400",
          )}
        >
          매도
        </button>
      </div>

      {/* 현재가 표시 */}
      <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
        <span className="text-Body_M_Light text-gray-500">현재가</span>
        <span className="text-Subtitle_S_Medium text-etc-red">
          {currentPrice.toLocaleString()} 원
        </span>
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

      {/* 포트폴리오 선택 */}
      <div className="flex flex-col gap-2">
        <span className="text-Body_M_Light text-gray-500">포트폴리오</span>
        <div className="relative" ref={dropdownRef}>
          {/* 드롭다운 버튼 */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={portfolios.length === 0}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-Body_M_Light outline-none transition-all flex items-center justify-between",
              portfolios.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-black hover:border-main-1 focus:border-main-1",
              isDropdownOpen && "border-main-1",
            )}
          >
            <span className="truncate">
              {portfolios.length === 0
                ? "포트폴리오 없음"
                : (portfolios.find((p) => p.id === selectedPortfolioId)?.name ??
                  "선택하세요")}
            </span>
            <ChevronIcon
              className={cn(
                "w-4 h-4 transition-transform ml-2 shrink-0",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && portfolios.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="max-h-[200px] overflow-y-auto">
                {portfolios.map((portfolio) => (
                  <button
                    key={portfolio.id}
                    type="button"
                    onClick={() => {
                      setSelectedPortfolioId(portfolio.id);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-Body_M_Light transition-colors",
                      selectedPortfolioId === portfolio.id
                        ? "bg-main-1/10 text-main-1 font-medium"
                        : "text-black hover:bg-gray-50",
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{portfolio.name}</span>
                      <div className="flex items-center gap-1 text-Caption_L_Light">
                        <span className="text-gray-500">총자산</span>
                        <span className="text-gray-700 font-normal">
                          ₩{portfolio.totalCurrentValue.toLocaleString()}
                        </span>
                        <span className="text-gray-400">(</span>
                        {portfolio.totalCurrentValue -
                          portfolio.totalPurchaseAmount ===
                        0 ? (
                          <span className="text-gray-400 font-normal">-</span>
                        ) : (
                          <div className="flex items-center gap-0.5">
                            <span
                              className={cn(
                                "opacity-70 font-normal",
                                portfolio.totalCurrentValue -
                                  portfolio.totalPurchaseAmount >
                                  0
                                  ? "text-etc-red"
                                  : "text-etc-blue",
                              )}
                            >
                              ₩
                              {Math.abs(
                                portfolio.totalCurrentValue -
                                  portfolio.totalPurchaseAmount,
                              ).toLocaleString()}
                            </span>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              className={cn(
                                "opacity-70",
                                portfolio.totalCurrentValue -
                                  portfolio.totalPurchaseAmount >
                                  0
                                  ? "text-etc-red"
                                  : "text-etc-blue"
                              )}
                            >
                              {portfolio.totalCurrentValue -
                                portfolio.totalPurchaseAmount >
                              0 ? (
                                // 위쪽 화살표
                                <path
                                  d="M5 1.5V8.5M5 1.5L2 4.5M5 1.5L8 4.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              ) : (
                                // 아래쪽 화살표
                                <path
                                  d="M5 8.5V1.5M5 8.5L2 5.5M5 8.5L8 5.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              )}
                            </svg>
                          </div>
                        )}
                        <span className="text-gray-400">)</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
                  : "bg-gray-800 text-white hover:bg-gray-700",
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
              : "bg-red-100 text-red-700",
          )}
        >
          {orderStatus.message}
        </div>
      )}

      {/* 주문 실행 버튼 */}
      <button
        onClick={handleOrder}
        disabled={createTrade.isPending || !selectedPortfolioId}
        className={cn(
          "w-full py-4 rounded-lg text-Subtitle_S_Medium transition-colors",
          createTrade.isPending || !selectedPortfolioId
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : tradeType === "buy"
              ? "bg-etc-red text-white hover:bg-red-600"
              : "bg-etc-blue text-white hover:bg-blue-600",
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
