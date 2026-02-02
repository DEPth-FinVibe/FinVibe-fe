import { useRef, useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

// --- Types (API 명세서 기준) ---

export interface QuotePayload {
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

interface QuoteMessage {
  type: "quote";
  topic: string;
  payload: QuotePayload;
}

interface AuthResponseMessage {
  type: "auth";
  status: "ok" | "error";
  message?: string;
}

interface PingMessage {
  type: "ping";
}

interface ErrorMessage {
  type: "error";
  code: string;
  message: string;
}

interface SubscribeResponseMessage {
  type: "subscribe";
  topic: string;
  status: "ok" | "error";
  message?: string;
}

interface UnsubscribeResponseMessage {
  type: "unsubscribe";
  topic: string;
  status: "ok" | "error";
  message?: string;
}

type ServerMessage =
  | QuoteMessage
  | AuthResponseMessage
  | PingMessage
  | ErrorMessage
  | SubscribeResponseMessage
  | UnsubscribeResponseMessage;

// --- Hook ---

interface UseMarketWebSocketOptions {
  onQuote?: (payload: QuotePayload) => void;
  onError?: (code: string, message: string) => void;
}

function buildWsUrl(): string {
  const envUrl = import.meta.env.VITE_WS_MARKET_URL;
  if (envUrl) return envUrl;

  const { protocol, host } = window.location;
  const wsProtocol = protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${host}/api/market/ws`;
}

export function useMarketWebSocket(options: UseMarketWebSocketOptions = {}) {
  const { onQuote, onError } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const intentionalCloseRef = useRef(false);

  // Stable callback refs to avoid re-renders triggering reconnects
  const onQuoteRef = useRef(onQuote);
  onQuoteRef.current = onQuote;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const subscribedTopicsRef = useRef<Set<string>>(new Set());

  const send = useCallback((data: object) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }, []);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (intentionalCloseRef.current) return;
    clearReconnectTimer();
    const attempt = reconnectAttemptRef.current;
    const delay = Math.min(1000 * 2 ** attempt, 30000);
    reconnectAttemptRef.current = attempt + 1;
    reconnectTimerRef.current = setTimeout(() => {
      connect();
    }, delay);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(() => {
    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    intentionalCloseRef.current = false;
    const url = buildWsUrl();
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttemptRef.current = 0;

      // Authenticate immediately
      const tokens = useAuthStore.getState().tokens;
      if (tokens?.accessToken) {
        send({ type: "auth", token: tokens.accessToken });
      }
    };

    ws.onmessage = (event) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (msg.type) {
        case "ping":
          send({ type: "pong" });
          break;

        case "auth":
          if (msg.status === "ok") {
            setIsAuthenticated(true);
            // Re-subscribe to previously subscribed topics
            for (const topic of subscribedTopicsRef.current) {
              send({ type: "subscribe", topic });
            }
          } else {
            setIsAuthenticated(false);
            onErrorRef.current?.("AUTH_FAILED", msg.message ?? "Authentication failed");
          }
          break;

        case "quote":
          onQuoteRef.current?.(msg.payload);
          break;

        case "error":
          onErrorRef.current?.(msg.code, msg.message);
          break;

        case "subscribe":
        case "unsubscribe":
          // Could handle ack/nack here if needed
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsAuthenticated(false);
      wsRef.current = null;
      scheduleReconnect();
    };

    ws.onerror = () => {
      // onclose will fire after onerror, reconnect is handled there
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [send, scheduleReconnect]);

  const disconnect = useCallback(() => {
    intentionalCloseRef.current = true;
    clearReconnectTimer();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsAuthenticated(false);
    subscribedTopicsRef.current.clear();
  }, [clearReconnectTimer]);

  const subscribe = useCallback(
    (stockIds: (string | number)[]) => {
      for (const id of stockIds) {
        const topic = `stock.${id}`;
        subscribedTopicsRef.current.add(topic);
        send({ type: "subscribe", topic });
      }
    },
    [send],
  );

  const unsubscribe = useCallback(
    (stockIds: (string | number)[]) => {
      for (const id of stockIds) {
        const topic = `stock.${id}`;
        subscribedTopicsRef.current.delete(topic);
        send({ type: "unsubscribe", topic });
      }
    },
    [send],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intentionalCloseRef.current = true;
      clearReconnectTimer();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [clearReconnectTimer]);

  return {
    isConnected,
    isAuthenticated,
    subscribe,
    unsubscribe,
    connect,
    disconnect,
  };
}
