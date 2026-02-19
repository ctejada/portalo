"use client";

import type { Link } from "@portalo/shared";

interface LinkItemProps {
  link: Link;
  pageId: string;
  index: number;
  themeName: string;
}

export function LinkItem({ link, pageId, index, themeName }: LinkItemProps) {
  const isDark = themeName === "minimal-dark";
  const isEditorial = themeName === "editorial";

  function handleClick() {
    // Non-blocking analytics tracking
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
      className={`block py-2.5 text-sm transition-colors ${
        isDark
          ? "text-[#D1D5DB] hover:text-white"
          : "text-text-primary hover:underline"
      }`}
    >
      {isEditorial ? (
        <span className="flex items-baseline gap-2">
          <span className={isDark ? "text-[#6B7280]" : "text-text-tertiary"}>
            {index + 1}.
          </span>
          {link.title}
        </span>
      ) : (
        <span>&rarr; {link.title}</span>
      )}
    </a>
  );
}
