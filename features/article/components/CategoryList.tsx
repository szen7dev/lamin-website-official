'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryList() {
  // Create an array of 6 items to match the grid layout
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <nav
      aria-label="Danh mục bài viết"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
      {skeletonItems.map(item => (
        <div
          key={item}
          className="flex flex-col items-center rounded-lg p-4 transition-colors bg-white">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
          <Skeleton className="mt-3 h-5 w-20 rounded" />
        </div>
      ))}
    </nav>
  );
}
