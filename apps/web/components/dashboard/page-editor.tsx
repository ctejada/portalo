"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePage } from "@/hooks/use-page";
import { useLinks } from "@/hooks/use-links";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/ui/toast";
import { LinkList } from "@/components/dashboard/link-list";
import { LinkForm } from "@/components/dashboard/link-form";
import { PhonePreview } from "@/components/dashboard/phone-preview";
import { PreviewContent } from "@/components/dashboard/preview-content";
import { ThemePicker } from "@/components/dashboard/theme-picker";
import type { Link as LinkType, ThemeConfig } from "@portalo/shared";

interface PageEditorProps {
  pageId: string;
}

export function PageEditor({ pageId }: PageEditorProps) {
  const { page, isLoading, mutate } = usePage(pageId);
  const { links, isLoading: linksLoading, mutate: mutateLinks } = useLinks(pageId);
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState<ThemeConfig>({ name: "clean" });

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setBio(page.bio);
      setTheme(page.theme ?? { name: "clean" });
    }
  }, [page]);

  const handleDelete = useCallback(
    async (link: LinkType) => {
      if (!confirm(`Delete "${link.title}"?`)) return;

      const res = await fetch(`/api/v1/pages/${pageId}/links/${link.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        showToast("Failed to delete link", "error");
        return;
      }
      showToast("Link deleted", "success");
      mutateLinks();
    },
    [pageId, mutateLinks]
  );

  const handleToggleVisibility = useCallback(
    async (link: LinkType) => {
      const res = await fetch(`/api/v1/pages/${pageId}/links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !link.visible }),
      });
      if (!res.ok) {
        showToast("Failed to update visibility", "error");
        return;
      }
      mutateLinks();
    },
    [pageId, mutateLinks]
  );

  const handleThemeChange = useCallback(
    async (newTheme: ThemeConfig) => {
      setTheme(newTheme);
      const res = await fetch(`/api/v1/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
      if (!res.ok) {
        showToast("Failed to update theme", "error");
        return;
      }
      mutate();
    },
    [pageId, mutate]
  );

  const handleReorder = useCallback(
    async (linkIds: string[]) => {
      const res = await fetch(`/api/v1/pages/${pageId}/links/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_ids: linkIds }),
      });
      if (!res.ok) {
        showToast("Failed to reorder", "error");
      }
      mutateLinks();
    },
    [pageId, mutateLinks]
  );

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border-primary">
        <Link
          href="/dashboard"
          className="text-text-secondary hover:text-text-primary text-body"
        >
          &larr; Pages
        </Link>
        {page && (
          <span className="text-small text-text-tertiary">/ {page.slug}</span>
        )}
      </div>

      {/* Split view */}
      <div className="flex h-[calc(100%-57px)]">
        {/* Editor panel (60%) */}
        <div className="w-3/5 overflow-y-auto p-6 border-r border-border-primary">
          <div className="max-w-xl mx-auto space-y-8">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : page ? (
              <>
                {/* Title/bio inline edit */}
                <InlineFields
                  pageId={pageId}
                  title={title}
                  bio={bio}
                  onTitleChange={setTitle}
                  onBioChange={setBio}
                  onSave={() => mutate()}
                />

                {/* Links section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-section-title">Links</h2>
                  </div>
                  {linksLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : (
                    <LinkList
                      links={links}
                      pageId={pageId}
                      onReorder={handleReorder}
                      onUpdated={() => mutateLinks()}
                      onDelete={handleDelete}
                      onToggleVisibility={handleToggleVisibility}
                    />
                  )}
                  <LinkForm pageId={pageId} onAdded={() => mutateLinks()} />
                </div>

                {/* Theme section */}
                <ThemePicker currentTheme={theme} onChange={handleThemeChange} />
              </>
            ) : (
              <p className="text-body text-text-secondary">Page not found.</p>
            )}
          </div>
        </div>

        {/* Preview panel (40%) */}
        <div className="w-2/5 bg-bg-secondary flex items-start justify-center p-8 overflow-y-auto">
          <PhonePreview>
            <PreviewContent
              title={title}
              bio={bio}
              links={links}
              themeName={theme.name}
            />
          </PhonePreview>
        </div>
      </div>
    </div>
  );
}

function InlineFields({
  pageId,
  title,
  bio,
  onTitleChange,
  onBioChange,
  onSave,
}: {
  pageId: string;
  title: string;
  bio: string;
  onTitleChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onSave: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const save = useCallback(
    async (fields: { title?: string; bio?: string }) => {
      const res = await fetch(`/api/v1/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        showToast("Failed to save", "error");
        return;
      }
      onSave();
    },
    [pageId, onSave]
  );

  const debouncedSave = useCallback(
    (fields: { title?: string; bio?: string }) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => save(fields), 500);
    },
    [save]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => {
          onTitleChange(e.target.value);
          debouncedSave({ title: e.target.value, bio });
        }}
        placeholder="Page title"
        className="w-full bg-transparent text-page-title text-text-primary placeholder:text-text-tertiary focus:outline-none"
      />
      <textarea
        value={bio}
        onChange={(e) => {
          onBioChange(e.target.value);
          debouncedSave({ title, bio: e.target.value });
        }}
        placeholder="Write a short bio..."
        rows={3}
        className="w-full bg-transparent text-body text-text-primary placeholder:text-text-tertiary focus:outline-none resize-none"
      />
    </div>
  );
}
