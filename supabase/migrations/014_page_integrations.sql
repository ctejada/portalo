-- 014_page_integrations.sql
-- Adds integrations JSONB column to pages for GA, Meta Pixel, UTM, and analytics share tokens
-- Structure: { ga_id?: string, meta_pixel_id?: string, utm_enabled?: boolean, analytics_share_token?: string }

ALTER TABLE public.pages ADD COLUMN integrations JSONB;

-- Partial index for share token lookups (public analytics pages)
CREATE INDEX idx_pages_share_token
  ON public.pages (((integrations->>'analytics_share_token')))
  WHERE integrations->>'analytics_share_token' IS NOT NULL;
