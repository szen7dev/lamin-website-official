import { Skeleton } from '@/components/ui/skeleton';

export // Loading skeleton component
const ContactSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-3">
    <div className="flex items-center gap-3">
      {/* Avatar Skeleton */}
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />

      {/* Contact Info Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10 rounded-full" />
        </div>

        {/* Contact Details Skeleton */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
