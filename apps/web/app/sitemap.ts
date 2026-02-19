import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so"}`;

  const { data: pages } = await supabaseAdmin
    .from("pages")
    .select("slug, updated_at")
    .eq("published", true);

  return [
    { url: baseUrl, lastModified: new Date() },
    ...(pages ?? []).map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updated_at),
    })),
  ];
}
