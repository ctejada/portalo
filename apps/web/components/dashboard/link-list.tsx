"use client";

import type { Link } from "@portalo/shared";

interface LinkListProps {
  links: Link[];
}

export function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return (
      <p className="text-small text-text-tertiary py-4">
        No links yet. Add your first link below.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border-primary border-y border-border-primary">
      {links.map((link) => (
        <LinkRow key={link.id} link={link} />
      ))}
    </div>
  );
}

function LinkRow({ link }: { link: Link }) {
  return (
    <div className="flex items-center gap-3 py-3 px-2 group hover:bg-bg-secondary">
      {/* Drag handle placeholder */}
      <span className="text-text-tertiary cursor-grab select-none">⠿</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium text-text-primary truncate">
          {link.title}
        </p>
        <p className="text-small text-text-secondary truncate">{link.url}</p>
      </div>

      {/* Click count */}
      <span className="text-small text-text-tertiary tabular-nums">
        {link.clicks}
      </span>
    </div>
  );
}
