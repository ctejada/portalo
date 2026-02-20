import type { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api-auth";
import { getSupabaseClient } from "@/lib/supabase/api-client";
import { DEFAULT_LAYOUT } from "@portalo/shared";
import { invalidatePageCache } from "@/lib/cache";

type Params = { params: Promise<{ id: string }> };

const VALID_KINDS = ["spacer", "divider", "text"] as const;

function parseAddBlock(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (!VALID_KINDS.includes(b.kind as typeof VALID_KINDS[number])) return null;
  const props: Record<string, unknown> = {};
  if (b.props && typeof b.props === "object") {
    const p = b.props as Record<string, unknown>;
    if (typeof p.height === "number" && p.height >= 8 && p.height <= 96) props.height = p.height;
    if (typeof p.text === "string" && p.text.length <= 500) props.text = p.text;
  }
  const afterSection = typeof b.after_section === "number" ? b.after_section : undefined;
  return { kind: b.kind as typeof VALID_KINDS[number], props, after_section: afterSection };
}

function parseRemoveBlock(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.block_id !== "string" || !b.block_id) return null;
  return { block_id: b.block_id };
}

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

  const parsed = parseAddBlock(body);
  if (!parsed) {
    return Response.json(
      { error: { code: "validation_error", message: "Invalid block data. kind must be spacer, divider, or text." } },
      { status: 400 }
    );
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
  const block = { id: blockId, kind: parsed.kind, props: parsed.props };

  layout.blocks.push(block);

  const sectionEntry = { type: "block" as const, id: blockId };
  if (parsed.after_section !== undefined && parsed.after_section < layout.sections.length) {
    layout.sections.splice(parsed.after_section + 1, 0, sectionEntry);
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

  const parsed = parseRemoveBlock(body);
  if (!parsed) {
    return Response.json(
      { error: { code: "validation_error", message: "block_id is required" } },
      { status: 400 }
    );
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

  layout.blocks = layout.blocks.filter((b) => b.id !== parsed.block_id);
  layout.sections = layout.sections.filter(
    (s) => !(s.type === "block" && s.id === parsed.block_id)
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
