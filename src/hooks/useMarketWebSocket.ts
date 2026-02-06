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
  ok: boolean;
}

interface PingMessage {
  type: "ping";
  ts: number;
}

interface ErrorMessage {
  type: "error";
  request_id?: string;
  code: string;
  message: string;
  details?: object;
}

interface SubscribeResponseMessage {
  type: "subscribe";
  request_id?: string;
  subscribed: string[];
  already_subscribed: string[];
  rejected: string[];
}

interface UnsubscribeResponseMessage {
  type: "unsubscribe";
  ok: boolean;
  request_id?: string;
  unsubscribed: string[];
  not_subscribed: string[];
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

  // 개발 환경에서는 직접 백엔드 WebSocket 연결
  if (import.meta.env.DEV) {
    return "wss://finvibe.space/market/ws";
  }

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
    console.log("[MarketWS] Connecting to:", url);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[MarketWS] Connected");
      setIsConnected(true);
      reconnectAttemptRef.current = 0;

      // Authenticate immediately
      const tokens = useAuthStore.getState().tokens;
      if (tokens?.accessToken) {
        console.log("[MarketWS] Sending auth");
        send({ type: "auth", token: tokens.accessToken });

        // Python 테스트 코드처럼 auth 후 바로 subscribe (응답 안 기다림)
        if (subscribedTopicsRef.current.size > 0) {
          console.log("[MarketWS] Sending subscribe:", Array.from(subscribedTopicsRef.current));
          send({ type: "subscribe", topics: Array.from(subscribedTopicsRef.current) });
        }
      } else {
        console.warn("[MarketWS] No access token available");
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
          console.log("[MarketWS] Auth response:", msg);
          if (msg.ok) {
            console.log("[MarketWS] Authenticated successfully");
            setIsAuthenticated(true);
            // Re-subscribe to previously subscribed topics
            if (subscribedTopicsRef.current.size > 0) {
              console.log("[MarketWS] Re-subscribing to:", Array.from(subscribedTopicsRef.current));
              send({ type: "subscribe", topics: Array.from(subscribedTopicsRef.current) });
            }
          } else {
            console.warn("[MarketWS] Auth failed");
            setIsAuthenticated(false);
            onErrorRef.current?.("AUTH_FAILED", "Authentication failed");
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

    ws.onclose = (event) => {
      console.log("[MarketWS] Closed:", event.code, event.reason);
      setIsConnected(false);
      setIsAuthenticated(false);
      wsRef.current = null;
      scheduleReconnect();
    };

    ws.onerror = (error) => {
      console.error("[MarketWS] Error:", error);
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
      const topics = stockIds.map((id) => `quote:${id}`);
      topics.forEach((topic) => subscribedTopicsRef.current.add(topic));
      if (topics.length > 0) {
        console.log("[MarketWS] Subscribing to:", topics);
        send({ type: "subscribe", topics });
      }
    },
    [send],
  );

  const unsubscribe = useCallback(
    (stockIds: (string | number)[]) => {
      const topics = stockIds.map((id) => `quote:${id}`);
      topics.forEach((topic) => subscribedTopicsRef.current.delete(topic));
      if (topics.length > 0) {
        send({ type: "unsubscribe", topics });
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
