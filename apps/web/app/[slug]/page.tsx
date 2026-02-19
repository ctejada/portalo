import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreatorPage } from "@/components/public/creator-page";
import type { Page, Link } from "@portalo/shared";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPageBySlug(slug: string) {
  const { data: page } = await supabaseAdmin
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!page) return null;

  const { data: links } = await supabaseAdmin
    .from("links")
    .select("*")
    .eq("page_id", page.id)
    .eq("visible", true)
    .order("position", { ascending: true });

  return { page: page as Page, links: (links ?? []) as Link[] };
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPageBySlug(slug);

  if (!result) notFound();

  return <CreatorPage page={result.page} links={result.links} />;
}
