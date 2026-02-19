"use client";

import type { ThemeConfig } from "@portalo/shared";
import { THEME_NAMES } from "@portalo/shared";

interface ThemePickerProps {
  currentTheme: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
}

const THEME_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  clean: { label: "Clean", bg: "bg-white", text: "text-text-primary" },
  "minimal-dark": { label: "Minimal Dark", bg: "bg-[#0F0F0F]", text: "text-[#F9FAFB]" },
  editorial: { label: "Editorial", bg: "bg-[#FAFAF8]", text: "text-[#1A1A1A]" },
};

export function ThemePicker({ currentTheme, onChange }: ThemePickerProps) {
  return (
    <div>
      <h2 className="text-section-title mb-4">Theme</h2>
      <div className="grid grid-cols-3 gap-3">
        {THEME_NAMES.map((name) => {
          const meta = THEME_LABELS[name];
          const isActive = currentTheme.name === name;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange({ name })}
              className={`rounded-lg border-2 p-3 text-left transition-colors ${
                isActive
                  ? "border-accent"
                  : "border-border-primary hover:border-border-primary/80"
              }`}
            >
              {/* Mini preview */}
              <div
                className={`${meta.bg} rounded-md p-3 mb-2 h-16 flex flex-col items-center justify-center`}
              >
                <div className={`w-4 h-4 rounded-full ${
                  name === "minimal-dark" ? "bg-[#2A2A2A]" : "bg-bg-tertiary"
                } mb-1`} />
                <div className={`w-12 h-1 rounded ${
                  name === "minimal-dark" ? "bg-[#F9FAFB]" : "bg-text-primary"
                }`} />
                <div className={`w-8 h-0.5 rounded mt-1 ${
                  name === "minimal-dark" ? "bg-[#9CA3AF]" : "bg-text-tertiary"
                }`} />
              </div>
              <span className="text-small block text-center">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
