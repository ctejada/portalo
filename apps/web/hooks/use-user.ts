"use client";

import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro" | "business";
  email: string | null;
}

async function fetchUser(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  return profile
    ? { ...profile, email: user.email ?? null }
    : {
        id: user.id,
        username: null,
        display_name: null,
        avatar_url: null,
        plan: "free",
        email: user.email ?? null,
      };
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("user", fetchUser, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return {
    user: data ?? null,
    isLoading,
    error,
    mutate,
  };
}
