"use client";

import useSWR from "swr";
import type { Link } from "@portalo/shared";

async function fetchLinks(key: string): Promise<Link[]> {
  const pageId = key.split("/")[1];
  const res = await fetch(`/api/v1/pages/${pageId}/links`);
  if (!res.ok) throw new Error("Failed to fetch links");
  const json = await res.json();
  return json.data ?? [];
}

export function useLinks(pageId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `links/${pageId}`,
    fetchLinks,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  );

  return {
    links: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
