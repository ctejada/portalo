"use client";

import type { Link } from "@portalo/shared";
import type { ResolvedTheme } from "@/lib/themes";
import { SocialIcon } from "@/components/public/social-icons";

interface LinkItemProps {
  link: Link;
  pageId: string;
  index: number;
  theme: ResolvedTheme;
}

export function LinkItem({ link, pageId, index, theme }: LinkItemProps) {
  const isFeatured = link.display_mode === "featured";

  function handleClick() {
    fetch("/api/v1/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        link_id: link.id,
        event_type: "click",
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {});
  }

  return (
    <a
      href={link.url}
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
        <span>{isFeatured ? link.title : `${theme.linkPrefix(index)} ${link.title}`}</span>
      </span>
    </a>
  );
}
