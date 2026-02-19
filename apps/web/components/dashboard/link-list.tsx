"use client";

import type { Link } from "@portalo/shared";
import { LinkRow } from "@/components/dashboard/link-row";

interface LinkListProps {
  links: Link[];
  onEdit?: (link: Link) => void;
  onDelete?: (link: Link) => void;
  onToggleVisibility?: (link: Link) => void;
}

export function LinkList({
  links,
  onEdit,
  onDelete,
  onToggleVisibility,
}: LinkListProps) {
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
        <LinkRow
          key={link.id}
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
        />
      ))}
    </div>
  );
}
