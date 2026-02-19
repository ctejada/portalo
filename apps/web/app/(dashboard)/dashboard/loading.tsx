import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <Skeleton variant="text" width="6rem" height="2rem" />
        <Skeleton variant="rectangular" width="8rem" height="2.5rem" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height="4rem" className="w-full" />
        ))}
      </div>
    </div>
  );
}
