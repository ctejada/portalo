"use client";

import type { Link } from "@portalo/shared";

interface LinkRowProps {
  link: Link;
  onEdit?: (link: Link) => void;
  onDelete?: (link: Link) => void;
  onToggleVisibility?: (link: Link) => void;
}

export function LinkRow({
  link,
  onEdit,
  onDelete,
  onToggleVisibility,
}: LinkRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 px-2 group hover:bg-bg-secondary">
      {/* Drag handle */}
      <span className="text-text-tertiary cursor-grab select-none">⠿</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium text-text-primary truncate">
          {link.title}
        </p>
        <p className="text-small text-text-secondary truncate">{link.url}</p>
      </div>

      {/* Click count */}
      <span className="text-small text-text-tertiary tabular-nums shrink-0">
        {link.clicks}
      </span>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onToggleVisibility?.(link)}
          className="p-1 text-text-tertiary hover:text-text-primary"
          title={link.visible ? "Hide link" : "Show link"}
        >
          {link.visible ? "👁" : "👁‍🗨"}
        </button>
        <button
          type="button"
          onClick={() => onEdit?.(link)}
          className="p-1 text-text-tertiary hover:text-text-primary"
          title="Edit link"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(link)}
          className="p-1 text-text-tertiary hover:text-error"
          title="Delete link"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
