import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { createClient } from "@/lib/supabase/server";
import { checkFeature } from "@/lib/plan-gate";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const { allowed } = await checkFeature(auth.userId, "pro_analytics");
  if (!allowed) {
    return Response.json({ error: "Pro plan required for live analytics" }, { status: 403 });
  }

  const pageId = request.nextUrl.searchParams.get("page_id");
  if (!pageId) {
    return Response.json({ error: "page_id is required" }, { status: 400 });
  }

  // Verify page ownership
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("id")
    .eq("id", pageId)
    .eq("user_id", auth.userId)
    .single();

  if (!page) {
    return Response.json({ error: "Page not found" }, { status: 404 });
  }

  let lastSeen = new Date().toISOString();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const poll = async () => {
        try {
          const db = await createClient();
          const { data: events } = await db
            .from("analytics_events")
            .select("id, event_type, referrer, country, device, browser, created_at, link_id")
            .eq("page_id", pageId)
            .gt("created_at", lastSeen)
            .order("created_at", { ascending: false })
            .limit(20);

          if (events && events.length > 0) {
            lastSeen = events[0].created_at;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(events)}\n\n`));
          } else {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          }
        } catch {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        }
      };

      // Initial poll
      await poll();

      // Poll every 5 seconds
      const interval = setInterval(poll, 5000);

      // Clean up on abort
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
