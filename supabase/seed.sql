-- seed.sql
-- Test data for local development
-- Note: In production, profiles are created via the on_auth_user_created trigger.
-- This seed inserts directly for local testing without auth.

-- Test user profile (use a fixed UUID for predictable local dev)
INSERT INTO public.profiles (id, display_name, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo User', 'pro')
ON CONFLICT (id) DO NOTHING;

-- Demo page
INSERT INTO public.pages (id, user_id, slug, title, bio, theme, published)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'Demo Creator',
  'Welcome to my page! Check out my links below.',
  '{"name": "clean", "colors": {}}',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Sample links
INSERT INTO public.links (page_id, url, title, position, visible) VALUES
  ('10000000-0000-0000-0000-000000000001', 'https://example.com', 'My Website', 0, true),
  ('10000000-0000-0000-0000-000000000001', 'https://twitter.com/demo', 'Twitter', 1, true),
  ('10000000-0000-0000-0000-000000000001', 'https://github.com/demo', 'GitHub', 2, true),
  ('10000000-0000-0000-0000-000000000001', 'https://youtube.com/@demo', 'YouTube', 3, true),
  ('10000000-0000-0000-0000-000000000001', 'https://linkedin.com/in/demo', 'LinkedIn', 4, false);

-- Sample analytics events
INSERT INTO public.analytics_events (page_id, event_type, referrer, country, device, browser, created_at) VALUES
  ('10000000-0000-0000-0000-000000000001', 'view', 'https://google.com', 'US', 'desktop', 'Chrome', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'view', 'https://twitter.com', 'UK', 'mobile', 'Safari', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'view', NULL, 'DE', 'desktop', 'Firefox', NOW() - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000001', 'click', 'https://google.com', 'US', 'desktop', 'Chrome', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'click', NULL, 'US', 'mobile', 'Safari', NOW() - INTERVAL '3 days');

-- Sample contact
INSERT INTO public.contacts (page_id, email, source)
VALUES ('10000000-0000-0000-0000-000000000001', 'fan@example.com', 'demo page')
ON CONFLICT (page_id, email) DO NOTHING;
