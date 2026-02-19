"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so";

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
        <h1 className="text-body-strong text-text-primary">My Page</h1>
        {page && (
          <>
            <button
              onClick={async () => {
                const res = await fetch(`/api/v1/pages/${pageId}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ published: !page.published }),
                });
                if (!res.ok) {
                  showToast("Failed to update", "error");
                  return;
                }
                mutate();
                showToast(page.published ? "Page unpublished" : "Page published", "success");
              }}
              className={`text-tiny font-medium px-2 py-0.5 rounded-full transition-colors ${
                page.published
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : "bg-bg-tertiary text-text-secondary hover:bg-bg-hover"
              }`}
            >
              {page.published ? "Published" : "Draft"}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <a
                href={`https://${APP_DOMAIN}/@${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-text-secondary hover:text-text-primary transition-colors"
              >
                {APP_DOMAIN}/@{page.slug}
              </a>
              <button
                onClick={() => {
                  if (!page.published) return;
                  navigator.clipboard.writeText(
                    `https://${APP_DOMAIN}/@${page.slug}`
                  );
                  showToast("Link copied!", "success");
                }}
                disabled={!page.published}
                className="p-2.5 rounded hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Copy public link"
                title={page.published ? "Copy link" : "Publish your page first"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          </>
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
