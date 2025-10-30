import type { Metadata } from 'next';

import { Suspense } from 'react';

import StoreLocationsClient from './client';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import Loading from '@/app/loading';

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Hệ thống cửa hàng trên toàn quốc',
    description:
      'Tìm kiếm hệ thống nhà thuốc Lamin trên toàn quốc. Hotline 24/7 hỗ trợ tư vấn, mở cửa từ 8h-22h kể cả CN và lễ tết.',
    keywords: [
      'cửa hàng',
      'nhà thuốc',
      'hệ thống cửa hàng',
      'Lamin',
      'vị trí cửa hàng',
      'hotline',
    ],
  });
}

export default function StoreLocationsPage() {
  return (
    <section className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto">
        <DynamicBreadcrumb />
      </div>

      <Suspense fallback={<Loading />}>
        <StoreLocationsClient />
      </Suspense>
    </section>
  );
}
