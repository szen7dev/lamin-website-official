'use client';

import { Suspense } from 'react';

import { ClientStoreDetail } from './client';

import Loading from '@/app/loading';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';

export default function StoreDetailPage() {
  return (
    <main className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto mb-6">
        <DynamicBreadcrumb />
      </div>
      <Suspense fallback={<Loading />}>
        <ClientStoreDetail />
      </Suspense>
    </main>
  );
}
