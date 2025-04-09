'use client';

import { Suspense } from 'react';
import { notFound, useParams } from 'next/navigation';

import Loading from '@/app/loading';
import { StoreDetail } from '@/features/trusted-shop/components/StoreDetail';
import { useGetTrustedStore } from '@/features/homepage/hooks/stores/useGetTrustedStore';

export function ClientStoreDetail() {
  const { id } = useParams();
  // Use the hook with fundaID from params
  const { singleStore: store, isLoading } = useGetTrustedStore({
    fundaID: id as string,
    populates: {
      path: 'thumbnail area3 area2 area1',
      select: 'path name',
    },
    select:
      'name sign location address rating numberOfRating description phone',
    internal: 2,
  });

  // If store is not found and not loading, return 404
  if (!isLoading && !store) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      {store && (
        <StoreDetail error={null} isLoading={isLoading} store={store} />
      )}
    </Suspense>
  );
}
