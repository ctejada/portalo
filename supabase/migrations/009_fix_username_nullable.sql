-- 009_fix_username_nullable.sql
-- Fix: allow NULL usernames so the handle_new_user() trigger succeeds.
-- Migration 008 made username NOT NULL but never updated the trigger,
-- causing new-user profile creation to fail (and PUT /api/v1/account 500).

ALTER TABLE public.profiles ALTER COLUMN username DROP NOT NULL;

-- Back-fill profiles for any auth users orphaned by the broken trigger
INSERT INTO public.profiles (id, display_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', u.email)
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;
