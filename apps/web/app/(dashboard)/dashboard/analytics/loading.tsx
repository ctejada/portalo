import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton variant="text" width="8rem" height="2rem" />
        <Skeleton variant="rectangular" width="10rem" height="2rem" />
      </div>
      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border border-border-primary rounded-md space-y-2">
            <Skeleton variant="text" width="4rem" height="0.75rem" />
            <Skeleton variant="text" width="3rem" height="1.5rem" />
          </div>
        ))}
      </div>
      {/* Chart placeholder */}
      <Skeleton variant="rectangular" height="16rem" className="w-full" />
    </div>
  );
}
