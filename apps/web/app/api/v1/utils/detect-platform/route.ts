import type { NextRequest } from "next/server";
import { detectPlatform } from "@/lib/platform-detect";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return Response.json(
      { error: { code: "missing_param", message: "url query parameter required" } },
      { status: 400 }
    );
  }

  const platform = detectPlatform(url);
  return Response.json({ data: { platform } });
}
