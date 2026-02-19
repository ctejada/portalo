"use client";

import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarUpload } from "@/components/dashboard/avatar-upload";
import { PlanBadge } from "@/components/dashboard/plan-badge";
import type { Plan } from "@portalo/shared";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "portalo.so";

export default function SettingsProfilePage() {
  const { user, isLoading, mutate } = useUser();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState("");
  const [saving, setSaving] = useState(false);

  const name = displayName ?? user?.display_name ?? "";
  const currentUsername = username ?? user?.username ?? "";
  const usernameChanged = username !== null && username !== (user?.username ?? "");

  function handleUsernameChange(value: string) {
    const formatted = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 32);
    setUsername(formatted);
    setUsernameError("");
  }

  async function handleSave() {
    setSaving(true);
    setUsernameError("");
    try {
      const body: Record<string, string> = { display_name: name };
      if (usernameChanged) body.username = currentUsername;

      const res = await fetch("/api/v1/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error?.code === "username_taken") {
          setUsernameError("This username is already taken");
        } else if (json.error?.code === "username_reserved") {
          setUsernameError("This username is reserved");
        } else {
          showToast(json.error?.message || "Failed to save profile", "error");
        }
        return;
      }
      setUsername(null);
      setDisplayName(null);
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
            htmlFor="username"
            className="block text-small font-medium text-text-secondary mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={currentUsername}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder="your-name"
            className="w-full text-body bg-bg-primary border border-border-primary rounded-md px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="text-small text-text-tertiary mt-1">
            {APP_DOMAIN}/@{currentUsername || "your-name"}
          </p>
          {usernameChanged && (
            <p className="text-tiny text-warning mt-1">
              Changing your username will update your public URL. Your old link will no longer work.
            </p>
          )}
          {usernameError && (
            <p className="text-tiny text-error mt-1">{usernameError}</p>
          )}
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

        <div className="pt-4 border-t border-border-primary">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-small font-medium text-text-secondary">Plan</span>
            <PlanBadge plan={(user?.plan ?? "free") as Plan} />
          </div>
          <Link
            href="/dashboard/settings/billing"
            className="text-small text-accent hover:underline"
          >
            Manage billing &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
