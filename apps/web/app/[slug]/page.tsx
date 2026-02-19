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

  const now = new Date().toISOString();
  const activeLinks = ((links ?? []) as Link[]).filter((link) => {
    if (link.schedule_start && link.schedule_start > now) return false;
    if (link.schedule_end && link.schedule_end < now) return false;
    return true;
  });

  return { page: page as Page, links: activeLinks };
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

  const baseUrl = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so"}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: result.page.title || "Untitled",
    description: result.page.bio || undefined,
    url: `${baseUrl}/${result.page.slug}`,
    mainEntity: {
      "@type": "Person",
      name: result.page.title || "Untitled",
      url: `${baseUrl}/${result.page.slug}`,
      sameAs: result.links.map((link) => link.url),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker pageId={result.page.id} />
      <CreatorPage page={result.page} links={result.links} />
    </>
  );
}
