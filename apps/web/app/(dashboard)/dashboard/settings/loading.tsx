import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <Skeleton variant="text" width="5rem" height="2rem" />
      <Skeleton variant="circular" width={64} height={64} />
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton variant="text" width="3rem" height="0.75rem" />
          <Skeleton variant="rectangular" height="2.5rem" className="w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton variant="text" width="6rem" height="0.75rem" />
          <Skeleton variant="rectangular" height="2.5rem" className="w-full" />
        </div>
        <Skeleton variant="rectangular" width="4rem" height="2.5rem" />
      </div>
    </div>
  );
}
