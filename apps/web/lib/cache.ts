export const CACHE_HEADERS = {
  public_page: {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    "CDN-Cache-Control": "public, max-age=60",
  },
} as const;

export function getCacheKey(slug: string): string {
  return `page:${slug}`;
}

export async function invalidatePageCache(slug: string): Promise<void> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!zoneId || !apiToken) return;

  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so";
  await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: [`https://${domain}/api/v1/public/page/${slug}`],
      }),
    }
  ).catch(() => {});
}
