"use client";

import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui";
import { Skeleton, SkeletonAvatar } from "@/components/ui/skeleton";

export function UserNav() {
  const { user, isLoading } = useUser();

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
    </div>
  );
}
