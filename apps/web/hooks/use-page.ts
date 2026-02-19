"use client";

import useSWR from "swr";
import type { Page } from "@portalo/shared";

async function fetchPage(key: string): Promise<Page> {
  const id = key.split("/").pop();
  const res = await fetch(`/api/v1/pages/${id}`);
  if (!res.ok) throw new Error("Failed to fetch page");
  const json = await res.json();
  return json.data;
}

export function usePage(pageId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `pages/${pageId}`,
    fetchPage,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    }
  );

  return {
    page: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
