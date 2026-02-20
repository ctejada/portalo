"use client";

import { useRef } from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  onClear?: () => void;
}

export function ColorPicker({ label, value, onChange, onClear }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-8 h-8 rounded-md border border-border-primary cursor-pointer shrink-0"
        style={{ backgroundColor: value }}
        title={`Pick ${label} color`}
      />
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        aria-label={`${label} color picker`}
      />
      <div className="flex-1 min-w-0">
        <span className="text-small text-text-secondary block">{label}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
              onChange(e.target.value);
            }
          }}
          className="block w-full text-tiny text-text-primary bg-transparent focus:outline-none font-mono"
          placeholder="#000000"
        />
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-tiny text-text-tertiary hover:text-text-primary shrink-0"
          title="Reset to theme default"
        >
          Reset
        </button>
      )}
    </div>
  );
}
