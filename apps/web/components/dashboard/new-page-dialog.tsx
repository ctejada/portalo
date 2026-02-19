"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Dialog, DialogTitle, showToast } from "@/components/ui";
import { usePages } from "@/hooks/use-pages";

interface NewPageDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NewPageDialog({ open, onClose }: NewPageDialogProps) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { mutate } = usePages();

  function handleSlugChange(value: string) {
    // Auto-format: lowercase, replace spaces with hyphens, strip invalid chars
    const formatted = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(formatted);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug.trim()) {
      setError("Slug is required");
      return;
    }

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/v1/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title: title || undefined }),
    });

    const json = await res.json();

    if (!res.ok) {
      setSubmitting(false);
      if (json.error?.code === "slug_taken") {
        setError("This slug is already taken");
      } else if (json.error?.code === "plan_limit") {
        setError(json.error.message);
      } else {
        setError(json.error?.message || "Something went wrong");
      }
      return;
    }

    await mutate();
    showToast("Page created", "success");
    setSlug("");
    setTitle("");
    setSubmitting(false);
    onClose();
    router.push(`/dashboard/pages/${json.data.id}`);
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New page</DialogTitle>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="slug"
            className="text-small text-text-secondary mb-1.5 block"
          >
            Slug
          </label>
          <Input
            id="slug"
            placeholder="my-page"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            autoFocus
          />
          <p className="text-tiny text-text-tertiary mt-1">
            portalo.so/{slug || "my-page"}
          </p>
          {error && (
            <p className="text-tiny text-error mt-1">{error}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="text-small text-text-secondary mb-1.5 block"
          >
            Title (optional)
          </label>
          <Input
            id="title"
            placeholder="My Page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" size="md" disabled={submitting || !slug}>
            {submitting ? "Creating..." : "Create page"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
