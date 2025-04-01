import type { Metadata } from 'next';

import { Suspense } from 'react';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import StoreList from '@/features/trusted-shop/components/StoreList';
import Loading from '@/app/loading';

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Hệ thống cửa hàng trên toàn quốc',
    description: 'Hệ thống cửa hàng trên toàn quốc',
    keywords: ['cửa hàng', 'dịch vụ', 'vị trí'],
  });
}

export default function StoreLocationsPage() {
  return (
    <section className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto">
        <DynamicBreadcrumb />
      </div>

      {/* Banner Section */}
      <section className="container mx-auto mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-1 bg-primary" />
          <h2 className="text-lg font-semibold text-black">
            Hệ thống cửa hàng trên toàn quốc
          </h2>
        </div>
      </section>

      <Suspense fallback={<Loading />}>
        <StoreList />
      </Suspense>
    </section>
  );
}
