export const CACHE_HEADERS = {
  public_page: {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    "CDN-Cache-Control": "public, max-age=60",
  },
} as const;

export function getCacheKey(slug: string): string {
  return `page:${slug}`;
}
