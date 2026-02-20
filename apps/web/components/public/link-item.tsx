"use client";

import type { Link } from "@portalo/shared";
import type { ResolvedTheme } from "@/lib/themes";
import { SocialIcon } from "@/components/public/social-icons";
import { getOrCreateVisitorId, detectDevice, detectBrowser, getTimeToClick } from "@/components/public/view-tracker";

interface LinkItemProps {
  link: Link;
  pageId: string;
  index: number;
  theme: ResolvedTheme;
  utmEnabled?: boolean;
}

function buildUtmUrl(url: string, pageId: string, linkTitle: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "portalo");
    u.searchParams.set("utm_medium", "link-in-bio");
    u.searchParams.set("utm_campaign", pageId.slice(0, 8));
    u.searchParams.set("utm_content", linkTitle.toLowerCase().replace(/\s+/g, "-").slice(0, 50));
    return u.toString();
  } catch {
    return url;
  }
}

export function LinkItem({ link, pageId, index, theme, utmEnabled }: LinkItemProps) {
  const isFeatured = link.display_mode === "featured";

  function handleClick() {
    const timeToClick = getTimeToClick();
    fetch("/api/v1/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        link_id: link.id,
        event_type: "click",
        referrer: document.referrer || undefined,
        visitor_id: getOrCreateVisitorId(),
        device: detectDevice(),
        browser: detectBrowser(),
        ...(timeToClick !== undefined && { time_to_click_ms: timeToClick }),
      }),
    }).catch(() => {});
  }

  return (
    <a
      href={utmEnabled ? buildUtmUrl(link.url, pageId, link.title) : link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`block py-2.5 text-sm transition-colors ${theme.linkText} ${
        isFeatured ? "px-4 py-3 rounded-lg" : ""
      }`}
      style={{
        ...(isFeatured ? theme.customStyles.linkBg : {}),
        ...(theme.customStyles.linkText ?? {}),
      }}
    >
      <span className="inline-flex items-center gap-2">
        {link.platform && <SocialIcon platform={link.platform} size={16} className="opacity-60 shrink-0" />}
        <span>{isFeatured ? link.title : `${theme.linkPrefix === "numbered" ? `${index + 1}.` : "\u2192"} ${link.title}`}</span>
      </span>
    </a>
  );
}
