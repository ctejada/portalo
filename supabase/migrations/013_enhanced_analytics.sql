-- 013_enhanced_analytics.sql
-- Adds visitor_id and time_to_click_ms columns to analytics_events
-- for unique visitor tracking and engagement timing metrics

ALTER TABLE public.analytics_events
  ADD COLUMN visitor_id TEXT,
  ADD COLUMN time_to_click_ms INTEGER;

-- Index for unique visitor counting (visitor_id + page_id + event_type)
CREATE INDEX idx_analytics_visitor ON public.analytics_events(visitor_id, page_id)
  WHERE visitor_id IS NOT NULL;

-- Index for hourly aggregation queries
CREATE INDEX idx_analytics_hour ON public.analytics_events(page_id, event_type, created_at);
