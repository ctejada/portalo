import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { usernameSchema } from "@portalo/shared";

const RESERVED_USERNAMES = [
  "about", "pricing", "blog", "contact", "help", "api", "admin",
  "login", "signup", "dashboard", "settings", "support", "terms",
  "privacy", "app", "www", "mail", "ftp", "docs", "status",
];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return Response.json(
      { error: { code: "missing_username", message: "username param required" } },
      { status: 400 }
    );
  }

  const parsed = usernameSchema.safeParse(username);
  if (!parsed.success) {
    return Response.json({ available: false, reason: "invalid_format" });
  }

  if (RESERVED_USERNAMES.includes(parsed.data)) {
    return Response.json({ available: false, reason: "reserved" });
  }

  const { count } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("username", parsed.data);

  return Response.json({ available: (count ?? 0) === 0 });
}
