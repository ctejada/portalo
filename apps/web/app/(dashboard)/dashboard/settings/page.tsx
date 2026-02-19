"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarUpload } from "@/components/dashboard/avatar-upload";

export default function SettingsProfilePage() {
  const { user, isLoading, mutate } = useUser();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const name = displayName ?? user?.display_name ?? "";

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });
      if (!res.ok) {
        showToast("Failed to save profile", "error");
        return;
      }
      await mutate();
      showToast("Profile updated", "success");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-page-title mb-6">Profile</h1>

      <div className="space-y-4">
        {user && (
          <AvatarUpload
            userId={user.id}
            currentUrl={user.avatar_url}
            onUploaded={() => mutate()}
          />
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-small font-medium text-text-secondary mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email ?? ""}
            disabled
            className="w-full text-body bg-bg-secondary border border-border-primary rounded-md px-3 py-2 text-text-tertiary"
          />
        </div>

        <div>
          <label
            htmlFor="displayName"
            className="block text-small font-medium text-text-secondary mb-1"
          >
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={name}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full text-body bg-bg-primary border border-border-primary rounded-md px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
