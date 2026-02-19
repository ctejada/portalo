"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { usePages } from "@/hooks/use-pages";
import { PageList } from "@/components/dashboard/page-list";
import { NewPageDialog } from "@/components/dashboard/new-page-dialog";

export default function DashboardPage() {
  const { pages, isLoading } = usePages();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-page-title">Pages</h1>
        <Button size="md" onClick={() => setDialogOpen(true)}>
          + New page
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : pages.length > 0 ? (
        <PageList pages={pages} />
      ) : (
        <div className="py-16 text-center">
          <p className="text-body text-text-secondary mb-4">
            No pages yet. Create your first page to get started.
          </p>
          <Button size="md" onClick={() => setDialogOpen(true)}>
            + New page
          </Button>
        </div>
      )}

      <NewPageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
