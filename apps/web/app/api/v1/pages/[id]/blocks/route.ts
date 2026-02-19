import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { getSupabaseClient } from "@/lib/supabase/api-client";
import { DEFAULT_LAYOUT } from "@portalo/shared";
import { invalidatePageCache } from "@/lib/cache";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const addBlockSchema = z.object({
  kind: z.enum(["spacer", "divider", "text"]),
  props: z.object({
    height: z.number().int().min(8).max(96).optional(),
    text: z.string().max(500).optional(),
  }).optional().default({}),
  after_section: z.number().int().min(0).optional(),
});

const removeBlockSchema = z.object({
  block_id: z.string().min(1),
});

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = addBlockSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  const { data: page, error: findError } = await supabase
    .from("pages")
    .select("id, slug, layout")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (findError || !page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  const layout = (page.layout as { sections: { type: string; id?: string }[]; blocks: { id: string; kind: string; props: Record<string, unknown> }[] }) ?? {
    sections: [...DEFAULT_LAYOUT.sections],
    blocks: [],
  };

  const blockId = crypto.randomUUID().slice(0, 8);
  const block = { id: blockId, kind: parsed.data.kind, props: parsed.data.props };

  layout.blocks.push(block);

  const sectionEntry = { type: "block" as const, id: blockId };
  if (parsed.data.after_section !== undefined && parsed.data.after_section < layout.sections.length) {
    layout.sections.splice(parsed.data.after_section + 1, 0, sectionEntry);
  } else {
    layout.sections.push(sectionEntry);
  }

  const { error } = await supabase
    .from("pages")
    .update({ layout })
    .eq("id", id);

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  invalidatePageCache(page.slug).catch(() => {});

  return Response.json({ data: block }, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await getApiUser(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = removeBlockSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const supabase = await getSupabaseClient(auth.isApiKey);

  const { data: page, error: findError } = await supabase
    .from("pages")
    .select("id, slug, layout")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .single();

  if (findError || !page) {
    return Response.json(
      { error: { code: "not_found", message: "Page not found" } },
      { status: 404 }
    );
  }

  const layout = (page.layout as { sections: { type: string; id?: string }[]; blocks: { id: string; kind: string; props: Record<string, unknown> }[] }) ?? {
    sections: [...DEFAULT_LAYOUT.sections],
    blocks: [],
  };

  layout.blocks = layout.blocks.filter((b) => b.id !== parsed.data.block_id);
  layout.sections = layout.sections.filter(
    (s) => !(s.type === "block" && s.id === parsed.data.block_id)
  );

  const { error } = await supabase
    .from("pages")
    .update({ layout })
    .eq("id", id);

  if (error) {
    return Response.json(
      { error: { code: "db_error", message: error.message } },
      { status: 500 }
    );
  }

  invalidatePageCache(page.slug).catch(() => {});

  return new Response(null, { status: 204 });
}
