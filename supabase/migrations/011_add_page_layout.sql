-- 011_add_page_layout.sql
-- Adds layout JSONB column to pages for section ordering and blocks
-- NULL = default layout (header, links)

ALTER TABLE public.pages ADD COLUMN layout JSONB;
