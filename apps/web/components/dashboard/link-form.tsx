"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { showToast } from "@/components/ui/toast";

interface LinkFormProps {
  pageId: string;
  onAdded: () => void;
}

export function LinkForm({ pageId, onAdded }: LinkFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url || !title) return;

    setLoading(true);
    const res = await fetch(`/api/v1/pages/${pageId}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title }),
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
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          className="w-full px-3 py-1.5 bg-bg-tertiary border border-border-primary rounded-md text-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <Button size="sm" type="submit" loading={loading}>
        Add
      </Button>
    </form>
  );
}
