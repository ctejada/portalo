"use client";

import { useState, useRef, useEffect } from "react";

interface AddBlockMenuProps {
  onAdd: (kind: "spacer" | "divider" | "text") => void;
}

const BLOCK_OPTIONS = [
  { kind: "spacer" as const, label: "Spacer", description: "Add vertical space" },
  { kind: "divider" as const, label: "Divider", description: "Horizontal line" },
  { kind: "text" as const, label: "Text", description: "Custom text block" },
];

export function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-small text-text-secondary hover:text-text-primary transition-colors"
      >
        + Add block
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-bg-primary border border-border-primary rounded-md shadow-lg z-20">
          {BLOCK_OPTIONS.map((opt) => (
            <button
              key={opt.kind}
              type="button"
              onClick={() => {
                onAdd(opt.kind);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-bg-secondary transition-colors first:rounded-t-md last:rounded-b-md"
            >
              <span className="text-small text-text-primary block">{opt.label}</span>
              <span className="text-tiny text-text-tertiary">{opt.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
