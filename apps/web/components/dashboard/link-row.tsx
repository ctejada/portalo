"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Link, DisplayMode } from "@portalo/shared";
import { DISPLAY_MODES } from "@portalo/shared";
import { Button } from "@/components/ui";
import { showToast } from "@/components/ui/toast";
import { SocialIcon } from "@/components/public/social-icons";

interface LinkRowProps {
  link: Link;
  pageId: string;
  onUpdated?: () => void;
  onDelete?: (link: Link) => void;
  onToggleVisibility?: (link: Link) => void;
}

export function LinkRow({
  link,
  pageId,
  onUpdated,
  onDelete,
  onToggleVisibility,
}: LinkRowProps) {
  const [editing, setEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`py-3 px-2 group hover:bg-bg-secondary ${
        isDragging ? "shadow-sm scale-[1.01] bg-bg-secondary z-10 relative" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button
          type="button"
          className="text-text-tertiary cursor-grab select-none touch-none"
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>

        {/* Platform icon */}
        {link.platform && (
          <SocialIcon platform={link.platform} size={16} className="text-text-secondary shrink-0" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-body font-medium text-text-primary truncate">
              {link.title}
            </p>
            {link.display_mode && link.display_mode !== "default" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-secondary shrink-0">
                {link.display_mode === "featured" ? "Featured" : "Icon only"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-small text-text-secondary truncate">{link.url}</p>
            {(link.schedule_start || link.schedule_end) && (
              <span className="text-tiny text-warning shrink-0">Scheduled</span>
            )}
          </div>
        </div>

        {/* Click count */}
        <span className="text-small text-text-tertiary tabular-nums shrink-0">
          {link.clicks}
        </span>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DisplayModeToggle link={link} pageId={pageId} onUpdated={onUpdated} />
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
            onClick={() => setEditing(!editing)}
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

      {/* Inline edit form */}
      {editing && (
        <InlineEditForm
          link={link}
          pageId={pageId}
          onSaved={() => {
            setEditing(false);
            onUpdated?.();
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}

function InlineEditForm({
  link,
  pageId,
  onSaved,
  onCancel,
}: {
  link: Link;
  pageId: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [scheduleStart, setScheduleStart] = useState(
    link.schedule_start ? link.schedule_start.slice(0, 16) : ""
  );
  const [scheduleEnd, setScheduleEnd] = useState(
    link.schedule_end ? link.schedule_end.slice(0, 16) : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/v1/pages/${pageId}/links/${link.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        url,
        schedule_start: scheduleStart ? new Date(scheduleStart).toISOString() : null,
        schedule_end: scheduleEnd ? new Date(scheduleEnd).toISOString() : null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      showToast("Failed to update link", "error");
      return;
    }

    showToast("Link updated", "success");
    onSaved();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 ml-8 space-y-2"
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Link title"
        required
        className="w-full px-3 py-1.5 bg-bg-tertiary border border-border-primary rounded-md text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        required
        className="w-full px-3 py-1.5 bg-bg-tertiary border border-border-primary rounded-md text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <div className="flex gap-3">
        <label className="flex-1 space-y-1">
          <span className="text-tiny">Start date</span>
          <input
            type="datetime-local"
            value={scheduleStart}
            onChange={(e) => setScheduleStart(e.target.value)}
            className="w-full px-3 py-1.5 bg-bg-tertiary border border-border-primary rounded-md text-small text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <label className="flex-1 space-y-1">
          <span className="text-tiny">End date</span>
          <input
            type="datetime-local"
            value={scheduleEnd}
            onChange={(e) => setScheduleEnd(e.target.value)}
            className="w-full px-3 py-1.5 bg-bg-tertiary border border-border-primary rounded-md text-small text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" type="submit" loading={loading}>
          Save
        </Button>
        <Button size="sm" variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

const DISPLAY_MODE_LABELS: Record<DisplayMode, string> = {
  default: "Default",
  featured: "Featured",
  "icon-only": "Icon only",
};

function DisplayModeToggle({
  link, pageId, onUpdated,
}: {
  link: Link; pageId: string; onUpdated?: () => void;
}) {
  const modes = DISPLAY_MODES;
  const currentIndex = modes.indexOf(link.display_mode ?? "default");
  const nextMode = modes[(currentIndex + 1) % modes.length];

  async function handleCycle() {
    const res = await fetch(`/api/v1/pages/${pageId}/links/${link.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_mode: nextMode }),
    });
    if (res.ok) {
      onUpdated?.();
    } else {
      showToast("Failed to update display mode", "error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCycle}
      className="p-1 text-[10px] text-text-tertiary hover:text-text-primary"
      title={`Display: ${DISPLAY_MODE_LABELS[link.display_mode ?? "default"]} → ${DISPLAY_MODE_LABELS[nextMode]}`}
    >
      {link.display_mode === "featured" ? "★" : link.display_mode === "icon-only" ? "◉" : "○"}
    </button>
  );
}
