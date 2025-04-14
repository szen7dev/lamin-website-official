import { Suspense } from 'react';

import { ClientStoreDetail } from './client';

import Loading from '@/app/loading';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { getTrustedStore } from '@/features/homepage/api/stores/getTrustedStore';

export default async function StoreDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const { trustedStore: storeInfo } = await getTrustedStore({ fundaID: id });

  // Since we're passing fundaID, we expect a single store
  const store = Array.isArray(storeInfo) ? storeInfo[0] : storeInfo;

  return (
    <section className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto mb-6">
        <DynamicBreadcrumb name={store?.name} />
      </div>
      <Suspense fallback={<Loading />}>
        <ClientStoreDetail />
      </Suspense>
    </section>
  );
}
