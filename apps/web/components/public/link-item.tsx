"use client";

import type { Link } from "@portalo/shared";
import { getTheme } from "@/lib/themes";

interface LinkItemProps {
  link: Link;
  pageId: string;
  index: number;
  themeName: string;
}

export function LinkItem({ link, pageId, index, themeName }: LinkItemProps) {
  const theme = getTheme(themeName);

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
      className={`block py-2.5 text-sm transition-colors ${theme.linkText}`}
    >
      <span>{theme.linkPrefix(index)} {link.title}</span>
    </a>
  );
}
