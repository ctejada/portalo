"use client";

import Link from "next/link";
import type { Page } from "@portalo/shared";
import { Badge } from "@/components/ui";
import { showToast } from "@/components/ui/toast";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so";

interface PageListProps {
  pages: Page[];
}

export function PageList({ pages }: PageListProps) {
  return (
    <div className="space-y-2">
      {pages.map((page) => (
        <PageRow key={page.id} page={page} />
      ))}
    </div>
  );
}

function PageRow({ page }: { page: Page }) {
  const publicUrl = `https://${APP_DOMAIN}/@${page.slug}`;

  return (
    <Link
      href={`/dashboard/pages/${page.id}`}
      className="flex items-center justify-between p-4 rounded-lg border border-border-primary hover:border-border-hover hover:bg-bg-hover transition-colors duration-150"
    >
      <div className="min-w-0 flex-1">
        <p className="text-body-strong truncate">
          {page.title || page.slug}
        </p>
        <p className="text-small text-text-tertiary mt-0.5 flex items-center gap-1.5">
          <span>{APP_DOMAIN}/@{page.slug}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigator.clipboard.writeText(publicUrl);
              showToast("Link copied!", "success");
            }}
            className="p-2.5 -m-2 rounded hover:bg-bg-active text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Copy link"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2.5 -m-2 rounded hover:bg-bg-active text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Open page in new tab"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="text-small text-text-tertiary">
          {page.views_count} {page.views_count === 1 ? "view" : "views"}
        </span>
        <Badge variant={page.published ? "success" : "default"}>
          {page.published ? "Published" : "Draft"}
        </Badge>
      </div>
    </Link>
  );
}
