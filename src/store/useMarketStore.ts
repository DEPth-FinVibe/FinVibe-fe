import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

// --- Types ---

export interface QuoteData {
  stockId: number;
  timeframe: string;
  at: string;
  open: number;
  high: number;
  low: number;
  close: number;
  prevDayChangePct: number;
  volume: number;
  value: number;
}

interface MarketState {
  // Connection state
  isConnected: boolean;
  isAuthenticated: boolean;

  // Real-time quote data by stockId
  quotes: Record<number, QuoteData>;

  // Subscribed topics
  subscribedStockIds: Set<number>;

  // Actions
  connect: () => void;
  disconnect: () => void;
  subscribe: (stockIds: number[]) => void;
  unsubscribe: (stockIds: number[]) => void;
  getQuote: (stockId: number) => QuoteData | undefined;
}

// --- WebSocket singleton ---

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;
let intentionalClose = false;

function readNumberField(
  source: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function normalizeQuoteData(
  raw: unknown,
  fallbackStockId?: number,
): QuoteData | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Record<string, unknown>;

  const stockId =
    readNumberField(source, ["stockId"]) ??
    fallbackStockId;

  if (!stockId) return null;

  const close = readNumberField(source, [
    "close",
    "currentPrice",
    "price",
    "tradePrice",
    "lastPrice",
  ]) ?? 0;
  const prevDayChangePct = readNumberField(source, [
    "prevDayChangePct",
    "changeRate",
    "changePct",
    "signedChangeRate",
  ]) ?? 0;
  const volume = readNumberField(source, [
    "volume",
    "accTradeVolume",
    "tradeVolume",
  ]) ?? 0;
  const value = readNumberField(source, [
    "value",
    "accTradeValue",
    "tradeValue",
  ]) ?? 0;

  const open = readNumberField(source, ["open"]) ?? close;
  const high = readNumberField(source, ["high"]) ?? close;
  const low = readNumberField(source, ["low"]) ?? close;

  return {
    stockId,
    timeframe: typeof source.timeframe === "string" ? source.timeframe : "MINUTE",
    at: typeof source.at === "string" ? source.at : new Date().toISOString(),
    open,
    high,
    low,
    close,
    prevDayChangePct,
    volume,
    value,
  };
}

function buildWsUrl(): string {
  const envUrl = import.meta.env.VITE_WS_MARKET_URL;
  if (envUrl) return envUrl;

  if (import.meta.env.DEV) {
    return "wss://finvibe.space/market/ws";
  }

  const { protocol, host } = window.location;
  const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${host}/market/ws`;
}

function send(data: object) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// --- Store ---

export const useMarketStore = create<MarketState>((set, get) => ({
  isConnected: false,
  isAuthenticated: false,
  quotes: {},
  subscribedStockIds: new Set(),

  connect: () => {
    if (ws && ws.readyState === WebSocket.OPEN) return;

    // Close existing connection
    if (ws) {
      ws.onclose = null;
      ws.close();
      ws = null;
    }

    intentionalClose = false;
    const url = buildWsUrl();
    console.log("[MarketStore] Connecting to:", url);
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("[MarketStore] Connected");
      set({ isConnected: true });
      reconnectAttempt = 0;

      // Authenticate
      const tokens = useAuthStore.getState().tokens;
      if (tokens?.accessToken) {
        console.log("[MarketStore] Sending auth");
        send({ type: "auth", token: tokens.accessToken });
      }
    };

    ws.onmessage = (event) => {
      let msg: unknown;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      if (!msg || typeof msg !== "object") return;
      const message = msg as {
        type?: string;
        ok?: boolean;
        payload?: unknown;
        topic?: string;
        data?: unknown;
        code?: string;
        message?: string;
      };

      console.log("[MarketStore] Message received:", message.type, message);

      switch (message.type) {
        case "ping":
          send({ type: "pong" });
          break;

        case "auth":
          if (message.ok) {
            console.log("[MarketStore] Authenticated");
            set({ isAuthenticated: true });

            // Re-subscribe to topics
            const { subscribedStockIds } = get();
            if (subscribedStockIds.size > 0) {
              const topics = Array.from(subscribedStockIds).map(
                (id) => `quote:${id}`,
              );
              console.log("[MarketStore] Re-subscribing to:", topics);
              send({ type: "subscribe", topics });
            }
          } else {
            console.warn("[MarketStore] Auth failed - stopping reconnect");
            set({ isAuthenticated: false });
            // 인증 실패 시 재연결 방지
            intentionalClose = true;
          }
          break;

        case "quote": {
          const quotePayload = normalizeQuoteData(message.payload);
          if (!quotePayload) break;
          set((state) => ({
            quotes: {
              ...state.quotes,
              [quotePayload.stockId]: quotePayload,
            },
          }));
          break;
        }

        case "event": {
          // topic이 "quote:stockId" 형식인 경우 처리
          if (message.topic?.startsWith("quote:")) {
            const stockId = parseInt(message.topic.split(":")[1], 10);
            const quotePayload = normalizeQuoteData(message.data, stockId);
            if (!quotePayload) break;
            console.log("[MarketStore] Quote data:", stockId, quotePayload);
            set((state) => ({
              quotes: {
                ...state.quotes,
                [stockId]: quotePayload,
              },
            }));
          }
          break;
        }

        case "error":
          console.warn("[MarketStore] Error:", message.code, message.message);
          break;
      }
    };

    ws.onclose = (event) => {
      console.log("[MarketStore] Closed:", event.code, event.reason);
      set({ isConnected: false, isAuthenticated: false });
      ws = null;

      // Reconnect if not intentional
      if (!intentionalClose) {
        const delay = Math.min(1000 * 2 ** reconnectAttempt, 30000);
        reconnectAttempt++;
        reconnectTimer = setTimeout(() => {
          get().connect();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("[MarketStore] Error:", error);
    };
  },

  disconnect: () => {
    intentionalClose = true;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      ws.close();
      ws = null;
    }
    set({
      isConnected: false,
      isAuthenticated: false,
      quotes: {},
      subscribedStockIds: new Set(),
    });
  },

  subscribe: (stockIds: number[]) => {
    const { subscribedStockIds, isAuthenticated } = get();
    const newIds = stockIds.filter((id) => !subscribedStockIds.has(id));

    if (newIds.length === 0) return;

    // Update subscribed set
    const updated = new Set(subscribedStockIds);
    newIds.forEach((id) => updated.add(id));
    set({ subscribedStockIds: updated });

    // Send subscribe message if authenticated
    if (isAuthenticated) {
      const topics = newIds.map((id) => `quote:${id}`);
      console.log("[MarketStore] Subscribing to:", topics);
      send({ type: "subscribe", topics });
    }
  },

  unsubscribe: (stockIds: number[]) => {
    const { subscribedStockIds, isAuthenticated } = get();
    const toRemove = stockIds.filter((id) => subscribedStockIds.has(id));

    if (toRemove.length === 0) return;

    // Update subscribed set
    const updated = new Set(subscribedStockIds);
    toRemove.forEach((id) => updated.delete(id));
    set({ subscribedStockIds: updated });

    // Send unsubscribe message if authenticated
    if (isAuthenticated) {
      const topics = toRemove.map((id) => `quote:${id}`);
      console.log("[MarketStore] Unsubscribing from:", topics);
      send({ type: "unsubscribe", topics });
    }
  },

  getQuote: (stockId: number) => {
    return get().quotes[stockId];
  },
}));

// --- Selector hooks for optimized re-renders ---

export function useQuote(stockId: number): QuoteData | undefined {
  return useMarketStore((state) => state.quotes[stockId]);
}

export function useQuotePrice(stockId: number): number | undefined {
  return useMarketStore((state) => state.quotes[stockId]?.close);
}

export function useQuoteChangePct(stockId: number): number | undefined {
  return useMarketStore((state) => state.quotes[stockId]?.prevDayChangePct);
}

export function useMarketConnection() {
  return useMarketStore((state) => ({
    isConnected: state.isConnected,
    isAuthenticated: state.isAuthenticated,
    connect: state.connect,
    disconnect: state.disconnect,
  }));
}
