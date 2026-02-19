-- 010_add_link_customization.sql
-- Adds platform detection and display mode fields to links

ALTER TABLE public.links
  ADD COLUMN platform TEXT,
  ADD COLUMN display_mode TEXT NOT NULL DEFAULT 'default';

ALTER TABLE public.links
  ADD CONSTRAINT links_display_mode_check
  CHECK (display_mode IN ('default', 'featured', 'icon-only'));
