"use client";

import Link from "next/link";
import type { Page } from "@portalo/shared";
import { Badge } from "@/components/ui";

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
  return (
    <Link
      href={`/dashboard/pages/${page.id}`}
      className="flex items-center justify-between p-4 rounded-lg border border-border-primary hover:border-border-hover hover:bg-bg-hover transition-colors duration-150"
    >
      <div className="min-w-0 flex-1">
        <p className="text-body-strong truncate">
          {page.title || page.slug}
        </p>
        <p className="text-small text-text-tertiary mt-0.5">
          /{page.slug}
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
