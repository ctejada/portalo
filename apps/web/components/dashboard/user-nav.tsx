"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui";
import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton";

export function UserNav() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <SkeletonAvatar size={32} />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.display_name
    ? user.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex items-center gap-3 min-w-0">
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt=""
          className="w-8 h-8 rounded-full shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0">
          <span className="text-tiny font-medium text-text-secondary">
            {initials}
          </span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-body-strong truncate">
          {user.display_name || user.email || "User"}
        </p>
        <Badge variant={user.plan === "free" ? "default" : "accent"}>
          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
        </Badge>
      </div>
      <button
        onClick={handleSignOut}
        className="shrink-0 p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors duration-150"
        title="Sign out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}
