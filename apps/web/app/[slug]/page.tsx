import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreatorPage } from "@/components/public/creator-page";
import { ViewTracker } from "@/components/public/view-tracker";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPageBySlug(slug);

  if (!result) {
    return { title: "Page Not Found" };
  }

  const { page } = result;
  const title = page.title || "Untitled";
  const description = page.bio || `${title} on Portalo`;

  return {
    title: `${title} - Portalo`,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/${page.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPageBySlug(slug);

  if (!result) notFound();

  return (
    <>
      <ViewTracker pageId={result.page.id} />
      <CreatorPage page={result.page} links={result.links} />
    </>
  );
}
