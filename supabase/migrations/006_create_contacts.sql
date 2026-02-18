-- 006_create_contacts.sql
-- Creates the contacts table with indexes and unique constraint

CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(page_id, email)
);

CREATE INDEX idx_contacts_page_id ON public.contacts(page_id);
