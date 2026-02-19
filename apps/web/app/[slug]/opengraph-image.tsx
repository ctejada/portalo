import { ImageResponse } from "next/og";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "edge";
export const alt = "Portalo page preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: page } = await supabaseAdmin
    .from("pages")
    .select("title, bio, slug")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const title = page?.title || "Untitled";
  const bio = page?.bio || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Avatar placeholder */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            backgroundColor: "#F3F4F6",
            marginBottom: 24,
            display: "flex",
          }}
        />
        {/* Title */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "#111827",
            marginBottom: 12,
            maxWidth: 800,
            textAlign: "center",
            display: "flex",
          }}
        >
          {title}
        </div>
        {/* Bio */}
        {bio && (
          <div
            style={{
              fontSize: 24,
              color: "#6B7280",
              maxWidth: 600,
              textAlign: "center",
              display: "flex",
            }}
          >
            {bio.length > 120 ? `${bio.slice(0, 120)}...` : bio}
          </div>
        )}
        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "#9CA3AF",
            display: "flex",
          }}
        >
          portalo.so
        </div>
      </div>
    ),
    { ...size }
  );
}
