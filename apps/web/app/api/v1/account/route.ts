import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { usernameSchema } from "@portalo/shared";

const RESERVED_USERNAMES = [
  "about", "pricing", "blog", "contact", "help", "api", "admin",
  "login", "signup", "dashboard", "settings", "support", "terms",
  "privacy", "app", "www", "mail", "ftp", "docs", "status",
];

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, plan, created_at")
    .eq("id", auth.userId)
    .single();

  if (error || !profile) {
    return Response.json(
      { error: { code: "not_found", message: "Profile not found" } },
      { status: 404 }
    );
  }

  return Response.json({ data: profile });
}

export async function PUT(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json();
  const updates: Record<string, string> = {};

  if (typeof body.display_name === "string") {
    updates.display_name = body.display_name.trim().slice(0, 100);
  }

  if (typeof body.avatar_url === "string") {
    updates.avatar_url = body.avatar_url;
  }

  if (typeof body.username === "string") {
    const parsed = usernameSchema.safeParse(body.username);
    if (!parsed.success) {
      return Response.json(
        { error: { code: "invalid_username", message: "Lowercase letters, numbers, and hyphens only (1-32 chars)" } },
        { status: 400 }
      );
    }
    if (RESERVED_USERNAMES.includes(parsed.data)) {
      return Response.json(
        { error: { code: "username_reserved", message: "This username is reserved" } },
        { status: 400 }
      );
    }
    updates.username = parsed.data;
  }

  if (Object.keys(updates).length === 0) {
    return Response.json(
      { error: { code: "bad_request", message: "No valid fields to update" } },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", auth.userId)
    .select("id, username, display_name, avatar_url, plan, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: { code: "username_taken", message: "This username is already taken" } },
        { status: 409 }
      );
    }
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  // Auto-create page when username is first set
  if (updates.username) {
    const { count } = await supabase
      .from("pages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", auth.userId);

    if (count === 0) {
      await supabase.from("pages").insert({
        user_id: auth.userId,
        slug: updates.username,
        title: updates.display_name || body.display_name || updates.username,
        published: true,
      });
    }
  }

  return Response.json({ data });
}
