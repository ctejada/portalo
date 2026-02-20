-- seed.sql
-- Test data for local development
-- Note: In production, profiles are created via the on_auth_user_created trigger.
-- For local seeding, we insert into auth.users first so the FK on profiles is satisfied.

-- Test auth user (fixed UUID for predictable local dev)
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@portalo.so',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"display_name": "Demo User"}'
)
ON CONFLICT (id) DO NOTHING;

-- Test user profile
INSERT INTO public.profiles (id, display_name, username, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo User', 'demo', 'pro')
ON CONFLICT (id) DO NOTHING;

-- Demo page (with icon-bar layout)
INSERT INTO public.pages (id, user_id, slug, title, bio, theme, published, layout)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'demo',
  'Demo Creator',
  'Welcome to my page! Check out my links below.',
  '{"name": "clean", "colors": {}}',
  true,
  '{"sections": [{"type": "header"}, {"type": "icon-bar"}, {"type": "links"}], "blocks": []}'
)
ON CONFLICT (slug) DO NOTHING;

-- Sample links with platform + display_mode (fixed IDs so analytics events can reference them)
INSERT INTO public.links (id, page_id, url, title, position, visible, platform, display_mode) VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'https://example.com', 'My Website', 0, true, NULL, 'featured'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'https://twitter.com/demo', 'Twitter', 1, true, 'twitter', 'icon-only'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'https://github.com/demo', 'GitHub', 2, true, 'github', 'icon-only'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'https://youtube.com/@demo', 'YouTube Channel', 3, true, 'youtube', 'default'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'https://linkedin.com/in/demo', 'LinkedIn', 4, false, 'linkedin', 'default'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'https://instagram.com/demo', 'Instagram', 5, true, 'instagram', 'icon-only');

-- Sample analytics events (click events include link_id for top-links analytics)
INSERT INTO public.analytics_events (page_id, event_type, link_id, referrer, country, device, browser, created_at) VALUES
  ('10000000-0000-0000-0000-000000000001', 'view', NULL, 'https://google.com', 'US', 'desktop', 'Chrome', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'view', NULL, 'https://twitter.com', 'UK', 'mobile', 'Safari', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'view', NULL, NULL, 'DE', 'desktop', 'Firefox', NOW() - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000001', 'click', '20000000-0000-0000-0000-000000000001', 'https://google.com', 'US', 'desktop', 'Chrome', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000001', 'click', '20000000-0000-0000-0000-000000000002', NULL, 'US', 'mobile', 'Safari', NOW() - INTERVAL '3 days');

-- Sample contact
INSERT INTO public.contacts (page_id, email, source)
VALUES ('10000000-0000-0000-0000-000000000001', 'fan@example.com', 'demo page')
ON CONFLICT (page_id, email) DO NOTHING;
