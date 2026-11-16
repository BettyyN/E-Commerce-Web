import { Skeleton } from "@/components/shared/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-40 sm:h-48 md:h-[240px] w-full rounded-xl" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
