"use client";

import useSWR from "swr";
import type { Page } from "@portalo/shared";

async function fetchPages(): Promise<Page[]> {
  const res = await fetch("/api/v1/pages");
  if (!res.ok) throw new Error("Failed to fetch pages");
  const json = await res.json();
  return json.data ?? [];
}

export function usePages() {
  const { data, error, isLoading, mutate } = useSWR("pages", fetchPages, {
    revalidateOnFocus: false,
    dedupingInterval: 30_000,
  });

  return {
    pages: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
