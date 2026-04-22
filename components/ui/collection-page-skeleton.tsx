import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CollectionPageSkeletonProps {
  gridClassName?: string;
  heroClassName?: string;
  mobileTiles?: number;
  showHeader?: boolean;
  sidebarHeightClassName?: string;
  topOffsetClassName?: string;
}

const CollectionPageSkeleton: React.FC<CollectionPageSkeletonProps> = ({
  gridClassName,
  heroClassName = "h-[300px]",
  mobileTiles = 0,
  showHeader = false,
  sidebarHeightClassName = "h-[680px]",
  topOffsetClassName = "mt-6",
}) => {
  return (
    <div className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      {showHeader ? (
        <div className="mb-8 space-y-3 border-b border-black/10 pb-5">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-5 w-[420px] max-w-full rounded-md" />
        </div>
      ) : null}

      <Skeleton className={cn("rounded-[10px]", heroClassName)} />

      {mobileTiles > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: mobileTiles }).map((_, index) => (
            <Skeleton className="h-28 rounded-[10px]" key={index} />
          ))}
        </div>
      ) : null}

      <div
        className={cn(
          "grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]",
          gridClassName,
          topOffsetClassName
        )}
      >
        <Skeleton className={cn("hidden rounded-[10px] lg:block", sidebarHeightClassName)} />
        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-12 w-72 rounded-xl" />
            <Skeleton className="h-12 w-80 rounded-xl" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton className="aspect-[0.8] rounded-[10px]" key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPageSkeleton;
