-- 007_rls_policies.sql
-- Enables Row Level Security and creates policies for all tables

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Pages: full CRUD on own pages, public read for published pages
CREATE POLICY pages_select ON public.pages
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY pages_insert ON public.pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY pages_update ON public.pages
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY pages_delete ON public.pages
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY pages_public_read ON public.pages
  FOR SELECT USING (published = true);

-- Links: CRUD on links belonging to user's pages, public read for published pages
CREATE POLICY links_select ON public.links
  FOR SELECT USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY links_insert ON public.links
  FOR INSERT WITH CHECK (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY links_update ON public.links
  FOR UPDATE USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY links_delete ON public.links
  FOR DELETE USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY links_public_read ON public.links
  FOR SELECT USING (page_id IN (SELECT id FROM public.pages WHERE published = true));

-- Domains: full CRUD on domains for user's pages
CREATE POLICY domains_select ON public.domains
  FOR SELECT USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY domains_insert ON public.domains
  FOR INSERT WITH CHECK (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY domains_update ON public.domains
  FOR UPDATE USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY domains_delete ON public.domains
  FOR DELETE USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));

-- Analytics: read own page analytics, insert controlled at API layer
CREATE POLICY analytics_select ON public.analytics_events
  FOR SELECT USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY analytics_insert ON public.analytics_events
  FOR INSERT WITH CHECK (true);

-- Contacts: read/delete own page contacts, insert is public (controlled at API layer)
CREATE POLICY contacts_select ON public.contacts
  FOR SELECT USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
CREATE POLICY contacts_insert ON public.contacts
  FOR INSERT WITH CHECK (true);
CREATE POLICY contacts_delete ON public.contacts
  FOR DELETE USING (page_id IN (SELECT id FROM public.pages WHERE user_id = auth.uid()));
