"use client";

import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Section, BlockConfig } from "@portalo/shared";

interface SectionListProps {
  sections: Section[];
  blocks: BlockConfig[];
  onReorder: (sections: Section[]) => void;
  onRemoveBlock: (blockId: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
  header: "Header",
  "icon-bar": "Social Icons",
  links: "Links",
};

function getSectionLabel(section: Section, blocks: BlockConfig[]): string {
  if (section.type === "block" && section.id) {
    const block = blocks.find((b) => b.id === section.id);
    if (block) {
      const kindLabel = { spacer: "Spacer", divider: "Divider", text: "Text" }[block.kind] ?? "Block";
      if (block.kind === "text" && block.props.text) {
        return `${kindLabel}: ${block.props.text.slice(0, 25)}${block.props.text.length > 25 ? "..." : ""}`;
      }
      return kindLabel;
    }
  }
  return SECTION_LABELS[section.type] ?? section.type;
}

function getSectionId(section: Section, index: number): string {
  if (section.type === "block" && section.id) return `block-${section.id}`;
  return `${section.type}-${index}`;
}

export function SectionList({ sections, blocks, onReorder, onRemoveBlock }: SectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sectionIds = sections.map((s, i) => getSectionId(s, i));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionIds.indexOf(active.id as string);
    const newIndex = sectionIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onReorder(reordered);
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          <div className="divide-y divide-border-secondary border border-border-primary rounded-md">
            {sections.map((section, i) => (
              <SectionRow
                key={sectionIds[i]}
                id={sectionIds[i]}
                label={getSectionLabel(section, blocks)}
                onRemove={section.type === "block" && section.id ? () => onRemoveBlock(section.id!) : undefined}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SectionRow({
  id, label, onRemove,
}: {
  id: string; label: string; onRemove?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`py-2.5 px-3 flex items-center gap-3 group ${isDragging ? "bg-bg-secondary z-10 relative" : ""}`}>
      <button type="button" className="text-text-tertiary cursor-grab select-none touch-none" {...attributes} {...listeners}>
        ⠿
      </button>
      <span className="text-small text-text-primary flex-1 truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-tiny text-text-tertiary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove block"
        >
          Remove
        </button>
      )}
    </div>
  );
}
