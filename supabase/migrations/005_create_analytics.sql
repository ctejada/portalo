-- 005_create_analytics.sql
-- Creates the analytics_events partitioned table with monthly partitions and indexes

CREATE TABLE public.analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  page_id UUID NOT NULL,
  link_id UUID,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'email_capture')),
  referrer TEXT,
  country TEXT,
  device TEXT CHECK (device IN ('mobile', 'tablet', 'desktop', NULL)),
  browser TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Monthly partitions for 2026
CREATE TABLE analytics_events_2026_01 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE analytics_events_2026_02 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE analytics_events_2026_03 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE analytics_events_2026_04 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE analytics_events_2026_05 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE analytics_events_2026_06 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE analytics_events_2026_07 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE analytics_events_2026_08 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
CREATE TABLE analytics_events_2026_09 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
CREATE TABLE analytics_events_2026_10 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
CREATE TABLE analytics_events_2026_11 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
CREATE TABLE analytics_events_2026_12 PARTITION OF public.analytics_events
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');

CREATE INDEX idx_analytics_page_created ON public.analytics_events(page_id, created_at);
CREATE INDEX idx_analytics_link_created ON public.analytics_events(link_id, created_at) WHERE link_id IS NOT NULL;
