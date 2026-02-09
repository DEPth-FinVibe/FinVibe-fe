import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tradeApi } from "@/api/trade";
import type { TransactionRequest, TradeResponse, TradeHistoryResponse } from "@/api/trade";

// --- Query Keys ---

export const tradeKeys = {
  all: ["trade"] as const,
  status: (tradeId: number) => [...tradeKeys.all, "status", tradeId] as const,
  reservedStockIds: () => [...tradeKeys.all, "reserved-stock-ids"] as const,
  history: (year: number, month: number) => [...tradeKeys.all, "history", year, month] as const,
};

// --- Queries ---

/** 거래 상태 조회 */
export function useTradeStatus(tradeId: number | undefined) {
  return useQuery({
    queryKey: tradeKeys.status(tradeId!),
    queryFn: () => tradeApi.getTradeStatus(tradeId!),
    enabled: tradeId != null,
  });
}

/** 예약 종목 ID 목록 조회 */
export function useReservedStockIds() {
  return useQuery({
    queryKey: tradeKeys.reservedStockIds(),
    queryFn: tradeApi.getReservedStockIds,
    staleTime: 30_000,
  });
}

/** 거래 기록 조회 (월별) */
export function useTradeHistory(year: number, month: number) {
  return useQuery({
    queryKey: tradeKeys.history(year, month),
    queryFn: () => tradeApi.getTradeHistory(year, month),
    staleTime: 60_000,
  });
}

// --- Mutations ---

/** 신규 거래 주문 생성 */
export function useCreateTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TransactionRequest) => tradeApi.createTrade(request),
    onSuccess: (data) => {
      // 예약 종목 목록 갱신
      if (data.tradeType === "RESERVED") {
        queryClient.invalidateQueries({ queryKey: tradeKeys.reservedStockIds() });
      }
      // 거래 내역 갱신
      queryClient.invalidateQueries({ queryKey: [...tradeKeys.all, "history"] });
    },
  });
}

/** 거래 취소 */
export function useCancelTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tradeId: number) => tradeApi.cancelTrade(tradeId),
    onSuccess: (data, tradeId) => {
      // 해당 거래 상태 캐시 업데이트
      queryClient.setQueryData<TradeResponse>(tradeKeys.status(tradeId), data);
      // 예약 종목 목록 갱신
      queryClient.invalidateQueries({ queryKey: tradeKeys.reservedStockIds() });
      // 거래 내역 갱신
      queryClient.invalidateQueries({ queryKey: [...tradeKeys.all, "history"] });
    },
  });
}

// --- Types re-export for convenience ---

export type { TransactionRequest, TradeResponse, TradeHistoryResponse };
