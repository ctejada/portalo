"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { showToast } from "@/components/ui/toast";
import type { PageIntegrations } from "@portalo/shared";

interface IntegrationsPanelProps {
  pageId: string;
  integrations: PageIntegrations | null;
  isPro: boolean;
  onUpdated: () => void;
}

export function IntegrationsPanel({ pageId, integrations, isPro, onUpdated }: IntegrationsPanelProps) {
  const [gaId, setGaId] = useState(integrations?.ga_id ?? "");
  const [pixelId, setPixelId] = useState(integrations?.meta_pixel_id ?? "");
  const [utmEnabled, setUtmEnabled] = useState(integrations?.utm_enabled ?? false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setGaId(integrations?.ga_id ?? "");
    setPixelId(integrations?.meta_pixel_id ?? "");
    setUtmEnabled(integrations?.utm_enabled ?? false);
  }, [integrations]);

  const save = useCallback(async (updates: Partial<PageIntegrations>) => {
    const res = await fetch(`/api/v1/pages/${pageId}/integrations`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      showToast("Failed to save integrations", "error");
      return;
    }
    onUpdated();
  }, [pageId, onUpdated]);

  const debouncedSave = useCallback((updates: Partial<PageIntegrations>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(updates), 800);
  }, [save]);

  if (!isPro) {
    return (
      <div className="p-4 rounded-lg border border-border-primary bg-bg-secondary">
        <p className="text-body text-text-secondary">
          Connect Google Analytics, Meta Pixel, and auto-append UTM parameters.
        </p>
        <p className="text-small text-text-tertiary mt-2">
          <span className="text-[10px] bg-accent text-text-inverse px-1.5 py-0.5 rounded mr-1">Pro</span>
          Upgrade to unlock integrations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-caption text-text-secondary block mb-1">Google Analytics ID</label>
        <input
          type="text"
          value={gaId}
          onChange={(e) => { setGaId(e.target.value); debouncedSave({ ga_id: e.target.value || undefined }); }}
          placeholder="G-XXXXXXXXXX"
          className="w-full px-3 py-2 text-small border border-border-primary rounded bg-bg-primary text-text-primary placeholder:text-text-tertiary"
        />
      </div>
      <div>
        <label className="text-caption text-text-secondary block mb-1">Meta Pixel ID</label>
        <input
          type="text"
          value={pixelId}
          onChange={(e) => { setPixelId(e.target.value); debouncedSave({ meta_pixel_id: e.target.value || undefined }); }}
          placeholder="1234567890"
          className="w-full px-3 py-2 text-small border border-border-primary rounded bg-bg-primary text-text-primary placeholder:text-text-tertiary"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={utmEnabled}
          onClick={() => { const next = !utmEnabled; setUtmEnabled(next); save({ utm_enabled: next }); }}
          className={`relative w-10 h-5 rounded-full transition-colors ${utmEnabled ? "bg-accent" : "bg-bg-tertiary"}`}
        >
          <span className={`absolute top-0.5 left-0.5 block w-4 h-4 rounded-full bg-white transition-transform ${utmEnabled ? "translate-x-5" : ""}`} />
        </button>
        <span className="text-small text-text-primary">Auto-append UTM parameters</span>
      </div>
    </div>
  );
}
