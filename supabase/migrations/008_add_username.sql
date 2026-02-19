-- 008_add_username.sql
-- Adds username column to profiles for @username URL routing
-- Also adds analytics counter trigger for views_count and clicks

-- Add username column
ALTER TABLE public.profiles ADD COLUMN username TEXT;

-- Backfill from existing page slugs (take the oldest page's slug)
UPDATE public.profiles p
SET username = (
  SELECT slug FROM public.pages
  WHERE user_id = p.id
  ORDER BY created_at ASC LIMIT 1
)
WHERE EXISTS (SELECT 1 FROM public.pages WHERE user_id = p.id);

-- For profiles without pages, derive from display_name or id
UPDATE public.profiles
SET username = LOWER(REGEXP_REPLACE(
  COALESCE(display_name, SUBSTRING(id::text, 1, 8)),
  '[^a-z0-9-]', '-', 'gi'
))
WHERE username IS NULL;

-- Enforce constraints
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE(username);
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Counter increment trigger on analytics_events
-- Automatically increments pages.views_count and links.clicks
-- when new analytics events are inserted
CREATE OR REPLACE FUNCTION update_analytics_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'view' THEN
    UPDATE pages SET views_count = views_count + 1 WHERE id = NEW.page_id;
  ELSIF NEW.event_type = 'click' AND NEW.link_id IS NOT NULL THEN
    UPDATE links SET clicks = clicks + 1 WHERE id = NEW.link_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_analytics_update_counters
  AFTER INSERT ON public.analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_counters();
