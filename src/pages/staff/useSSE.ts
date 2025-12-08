import { useEffect, useRef } from "react";

type SSEHandler = (event: string, data: any) => void;

export function useSSE(url: string, handler: SSEHandler) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!url) return;
    const es = new EventSource(url, { withCredentials: false });
    es.onmessage = (evt) => {
      try {
        handlerRef.current("message", JSON.parse(evt.data));
      } catch {
        handlerRef.current("message", evt.data);
      }
    };
    es.addEventListener("appointment_cancelled", (evt) => {
      try {
        handlerRef.current("appointment_cancelled", JSON.parse((evt as MessageEvent).data));
      } catch {
        handlerRef.current("appointment_cancelled", (evt as MessageEvent).data);
      }
    });
    es.addEventListener("slot_unlocked", (evt) => {
      try {
        handlerRef.current("slot_unlocked", JSON.parse((evt as MessageEvent).data));
      } catch {
        handlerRef.current("slot_unlocked", (evt as MessageEvent).data);
      }
    });
    return () => {
      es.close();
    };
  }, [url]);
}

