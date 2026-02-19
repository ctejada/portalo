import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function PageEditorLoading() {
  return (
    <div className="flex h-full">
      {/* Editor panel */}
      <div className="flex-1 p-6 space-y-6">
        <Skeleton variant="text" width="10rem" height="2rem" />
        <div className="space-y-4">
          <Skeleton variant="rectangular" height="2.5rem" className="w-full" />
          <Skeleton variant="rectangular" height="5rem" className="w-full" />
          <Skeleton variant="rectangular" height="2.5rem" className="w-full" />
        </div>
        <div className="pt-4 space-y-2">
          <Skeleton variant="text" width="4rem" height="1rem" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height="3.5rem" className="w-full" />
          ))}
        </div>
      </div>
      {/* Preview panel */}
      <div className="hidden lg:block w-96 border-l border-border-primary p-6">
        <Skeleton variant="text" width="5rem" height="1rem" className="mb-4" />
        <div className="flex flex-col items-center space-y-3">
          <Skeleton variant="circular" width={64} height={64} />
          <Skeleton variant="text" width="8rem" height="1.25rem" />
          <SkeletonText lines={2} className="w-full" />
        </div>
      </div>
    </div>
  );
}
