"use client";

import { useCallback, useRef, useEffect } from "react";
import type { ThemeConfig } from "@portalo/shared";
import { ColorPicker } from "@/components/dashboard/color-picker";
import { showToast } from "@/components/ui/toast";

interface ColorCustomizerProps {
  pageId: string;
  theme: ThemeConfig;
  onUpdated: () => void;
}

const COLOR_FIELDS = [
  { key: "bg", label: "Background" },
  { key: "text", label: "Text" },
  { key: "secondary", label: "Secondary text" },
  { key: "link_bg", label: "Link background" },
  { key: "link_text", label: "Link text" },
] as const;

const THEME_DEFAULTS: Record<string, Record<string, string>> = {
  clean: { bg: "#FFFFFF", text: "#111827", secondary: "#6B7280", link_bg: "#FFFFFF", link_text: "#111827" },
  "minimal-dark": { bg: "#0F0F0F", text: "#F9FAFB", secondary: "#9CA3AF", link_bg: "#0F0F0F", link_text: "#D1D5DB" },
  editorial: { bg: "#FAFAF8", text: "#1A1A1A", secondary: "#666666", link_bg: "#FAFAF8", link_text: "#1A1A1A" },
};

export function ColorCustomizer({ pageId, theme, onUpdated }: ColorCustomizerProps) {
  const colors = theme.colors ?? {};
  const defaults = THEME_DEFAULTS[theme.name] ?? THEME_DEFAULTS.clean;
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const saveColors = useCallback(
    async (newColors: Record<string, string>) => {
      const res = await fetch(`/api/v1/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: { name: theme.name, colors: newColors } }),
      });
      if (!res.ok) {
        showToast("Failed to save colors", "error");
        return;
      }
      onUpdated();
    },
    [pageId, theme.name, onUpdated]
  );

  const debouncedSave = useCallback(
    (newColors: Record<string, string>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => saveColors(newColors), 500);
    },
    [saveColors]
  );

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handleColorChange(key: string, value: string) {
    debouncedSave({ ...colors, [key]: value });
  }

  function handleClear(key: string) {
    const newColors = { ...colors };
    delete newColors[key];
    debouncedSave(newColors);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-small font-medium text-text-secondary">Custom Colors</h3>
      {COLOR_FIELDS.map(({ key, label }) => (
        <ColorPicker
          key={key}
          label={label}
          value={colors[key] ?? defaults[key]}
          onChange={(hex) => handleColorChange(key, hex)}
          onClear={colors[key] ? () => handleClear(key) : undefined}
        />
      ))}
    </div>
  );
}
