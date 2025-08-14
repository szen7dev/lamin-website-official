import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import HeightMeasurementResultClient from './result-client';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = generateSeoMetadata({
  title: 'Lamin-Kết quả đo cao',
  description: 'Xem kết quả đo cao và nhận tư vấn về chiều cao',
});

export default async function HeightMeasurementResultsPage({
  params,
}: PageProps) {
  // Đảm bảo đã await params trước khi sử dụng
  const resolvedParams = await Promise.resolve(params);
  const resultId = resolvedParams.id;

  // Validate required parameter
  if (!resultId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12 pt-4 sm:pt-6">
      <DynamicBreadcrumb />
      <HeightMeasurementResultClient resultId={resultId} />
    </div>
  );
}
