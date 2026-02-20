"use client";

import type { Link } from "@portalo/shared";
import type { ResolvedTheme } from "@/lib/themes";
import { SocialIcon } from "@/components/public/social-icons";

interface IconBarProps {
  links: Link[];
  pageId: string;
  theme: ResolvedTheme;
}

export function IconBar({ links, pageId, theme }: IconBarProps) {
  if (links.length === 0) return null;

  function trackClick(linkId: string) {
    fetch("/api/v1/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        link_id: linkId,
        event_type: "click",
      }),
    }).catch(() => {});
  }

  return (
    <div className="flex justify-center gap-4 py-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(link.id)}
          className={`p-2 rounded-full transition-opacity hover:opacity-70 ${theme.textSecondary}`}
          style={theme.customStyles.text}
          title={link.title}
          aria-label={link.title}
        >
          {link.platform ? (
            <SocialIcon platform={link.platform} size={20} />
          ) : (
            <span className="text-sm">{link.title.charAt(0)}</span>
          )}
        </a>
      ))}
    </div>
  );
}
