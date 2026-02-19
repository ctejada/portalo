"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Link } from "@portalo/shared";
import { LinkRow } from "@/components/dashboard/link-row";

interface LinkListProps {
  links: Link[];
  pageId: string;
  onReorder?: (linkIds: string[]) => void;
  onUpdated?: () => void;
  onDelete?: (link: Link) => void;
  onToggleVisibility?: (link: Link) => void;
}

export function LinkList({
  links,
  pageId,
  onReorder,
  onUpdated,
  onDelete,
  onToggleVisibility,
}: LinkListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (links.length === 0) {
    return (
      <p className="text-small text-text-tertiary py-4">
        No links yet. Add your first link below.
      </p>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...links];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder?.(reordered.map((l) => l.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="divide-y divide-border-primary border-y border-border-primary">
          {links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              pageId={pageId}
              onUpdated={onUpdated}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
