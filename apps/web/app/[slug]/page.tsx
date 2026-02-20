import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CreatorPage } from "@/components/public/creator-page";
import { ViewTracker } from "@/components/public/view-tracker";
import { AnalyticsScripts } from "@/components/public/analytics-scripts";
import type { Page, Link } from "@portalo/shared";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getPageByUsername = cache(async function getPageByUsername(username: string) {
  // Look up profile by username
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, username, plan")
    .eq("username", username)
    .single();

  if (!profile) return null;

  // Get their published page
  const { data: page } = await supabaseAdmin
    .from("pages")
    .select("*")
    .eq("user_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: true })
    .limit(1)
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

  return { page: page as Page, links: activeLinks, username: profile.username, plan: (profile.plan ?? "free") as string };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPageByUsername(slug);

  if (!result) {
    return { title: "Page Not Found" };
  }

  const { page, username } = result;
  const title = page.title || "Untitled";
  const description = page.bio || `${title} on Portalo`;

  return {
    title: `${title} - Portalo`,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/@${username}`,
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
  const result = await getPageByUsername(slug);

  if (!result) notFound();

  const { username } = result;
  const baseUrl = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so"}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: result.page.title || "Untitled",
    description: result.page.bio || undefined,
    url: `${baseUrl}/@${username}`,
    mainEntity: {
      "@type": "Person",
      name: result.page.title || "Untitled",
      url: `${baseUrl}/@${username}`,
      sameAs: result.links.map((link) => link.url),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnalyticsScripts integrations={result.page.integrations} />
      <ViewTracker pageId={result.page.id} />
      <CreatorPage page={result.page} links={result.links} ownerPlan={result.plan} />
    </>
  );
}
