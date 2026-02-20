"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui";
import { showToast } from "@/components/ui/toast";
import type { Platform } from "@portalo/shared";
import { SocialIcon } from "@/components/public/social-icons";

interface LinkFormProps {
  pageId: string;
  onAdded: () => void;
}

export function LinkForm({ pageId, onAdded }: LinkFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<Platform | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const detectPlatform = useCallback((inputUrl: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!inputUrl || inputUrl.length < 10) {
      setDetectedPlatform(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/utils/detect-platform?url=${encodeURIComponent(inputUrl)}`);
        if (res.ok) {
          const json = await res.json();
          setDetectedPlatform(json.data?.platform ?? null);
        }
      } catch {
        // ignore detection errors
      }
    }, 400);
  }, []);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  function handleUrlChange(value: string) {
    setUrl(value);
    detectPlatform(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url || !title) return;

    setLoading(true);
    const res = await fetch(`/api/v1/pages/${pageId}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title, platform: detectedPlatform }),
    });

    setLoading(false);

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      const message =
        json?.error?.message ?? json?.error?.code ?? "Failed to add link";
      showToast(message, "error");
      return;
    }

    setUrl("");
    setTitle("");
    setDetectedPlatform(null);
    showToast("Link added", "success");
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 mt-3">
      <div className="flex-1 space-y-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Link title"
          required
          className="w-full px-3 py-1.5 bg-bg-tertiary border border-border-primary rounded-md text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-3 py-1.5 bg-bg-tertiary border border-border-primary rounded-md text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent pr-8"
          />
          {detectedPlatform && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2">
              <SocialIcon platform={detectedPlatform} size={16} className="text-text-secondary" />
            </span>
          )}
        </div>
      </div>
      <Button size="sm" type="submit" loading={loading}>
        Add
      </Button>
    </form>
  );
}
