"use client";

import { useEffect, useRef, useState } from "react";

interface LiveEvent {
  id: string;
  event_type: string;
  referrer: string | null;
  country: string | null;
  device: string | null;
  browser: string | null;
  created_at: string;
  link_id: string | null;
}

interface LiveFeedProps {
  pageId: string;
}

const EVENT_LABELS: Record<string, string> = {
  view: "Page view",
  click: "Link click",
  email_capture: "Email signup",
};

export function LiveFeed({ pageId }: LiveFeedProps) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/v1/analytics/live?page_id=${pageId}`);
    esRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (e) => {
      try {
        const newEvents: LiveEvent[] = JSON.parse(e.data);
        setEvents((prev) => [...newEvents, ...prev].slice(0, 50));
      } catch {
        // heartbeat or parse error — ignore
      }
    };

    es.onerror = () => setConnected(false);

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [pageId]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-2 h-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-text-tertiary"}`}
        />
        <span className="text-caption text-text-secondary">
          {connected ? "Live" : "Connecting..."}
        </span>
      </div>
      <div className="max-h-80 overflow-y-auto space-y-1">
        {events.length === 0 ? (
          <p className="text-small text-text-tertiary py-4">Waiting for events...</p>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center gap-3 py-1.5 px-2 rounded text-small hover:bg-bg-hover transition-colors"
            >
              <span className="text-text-tertiary w-14 shrink-0">
                {new Date(ev.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span className="text-text-primary">
                {EVENT_LABELS[ev.event_type] ?? ev.event_type}
              </span>
              {ev.country && (
                <span className="text-text-tertiary">{ev.country}</span>
              )}
              {ev.device && (
                <span className="text-text-tertiary">{ev.device}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
