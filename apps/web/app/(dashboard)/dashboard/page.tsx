"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { usePages } from "@/hooks/use-pages";
import { PageEditor } from "@/components/dashboard/page-editor";
import { UsernameSetup } from "@/components/dashboard/username-setup";
import { UsernameNudgeBanner } from "@/components/dashboard/username-nudge-banner";

export default function DashboardPage() {
  const { user, isLoading: userLoading, mutate: mutateUser } = useUser();
  const { pages, isLoading: pagesLoading, mutate: mutatePages } = usePages();
  const [dismissed, setDismissed] = useState(false);

  if (userLoading || pagesLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  // No username → show setup dialog or nudge banner
  if (!user?.username) {
    if (dismissed) {
      return (
        <>
          <UsernameNudgeBanner onSetup={() => setDismissed(false)} />
          {pages[0] ? (
            <PageEditor pageId={pages[0].id} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-body text-text-secondary">
                Set up your username to create your page.
              </p>
            </div>
          )}
        </>
      );
    }
    return (
      <UsernameSetup
        displayName={user?.display_name}
        onComplete={() => { mutateUser(); mutatePages(); }}
        onDismiss={() => setDismissed(true)}
      />
    );
  }

  // Has page → show editor directly
  const page = pages[0];
  if (page) {
    return <PageEditor pageId={page.id} />;
  }

  // Edge case: has username but no page (shouldn't happen normally)
  return (
    <UsernameSetup
      displayName={user?.display_name}
      onComplete={() => { mutateUser(); mutatePages(); }}
      onDismiss={() => setDismissed(true)}
    />
  );
}
