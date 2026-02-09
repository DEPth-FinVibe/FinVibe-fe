import { tradeApiClient } from "@/api/trade/client";

// --- Types ---

export type TradeType = "NORMAL" | "RESERVED" | "CANCELLED";
export type TransactionType = "BUY" | "SELL";

export interface TransactionRequest {
  stockId: number;
  amount: number;
  price: number;
  portfolioId: number;
  tradeType: "NORMAL" | "RESERVED";
  transactionType: TransactionType;
}

export interface TradeResponse {
  tradeId: number;
  stockId: number;
  amount: number;
  price: number;
  portfolioId: number;
  userId: string;
  tradeType: TradeType;
  transactionType: TransactionType;
}

export interface TradeHistoryResponse {
  tradeId: number;
  stockId: number;
  amount: number;
  price: number;
  portfolioId: number;
  transactionType: TransactionType;
  tradeType: TradeType;
  createdAt: string;
}

// --- API ---

export const tradeApi = {
  /** 신규 거래 주문 생성: POST /api/trade/trades */
  createTrade: async (request: TransactionRequest): Promise<TradeResponse> => {
    const res = await tradeApiClient.post<TradeResponse>("/trades", request);
    return res.data;
  },

  /** 거래 상태 조회: GET /api/trade/trades/{tradeId} */
  getTradeStatus: async (tradeId: number): Promise<TradeResponse> => {
    const res = await tradeApiClient.get<TradeResponse>(`/trades/${tradeId}`);
    return res.data;
  },

  /** 거래 취소: DELETE /api/trade/trades/{tradeId} */
  cancelTrade: async (tradeId: number): Promise<TradeResponse> => {
    const res = await tradeApiClient.delete<TradeResponse>(`/trades/${tradeId}`);
    return res.data;
  },

  /** 예약 종목 ID 목록 조회: GET /api/trade/trades/reserved/stock-ids */
  getReservedStockIds: async (): Promise<number[]> => {
    const res = await tradeApiClient.get<number[]>("/trades/reserved/stock-ids");
    return res.data;
  },

  /** 거래 기록 조회 (월별, 최신순): GET /api/trade/trades/history */
  getTradeHistory: async (year: number, month: number): Promise<TradeHistoryResponse[]> => {
    const res = await tradeApiClient.get<TradeHistoryResponse[]>("/trades/history", {
      params: { year, month },
    });
    return res.data;
  },
};
