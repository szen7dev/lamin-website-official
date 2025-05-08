import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import HeightMeasurementResult from '@/features/height-measurement/components/HeightMeasurementResult';
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
      <div className="container mx-auto px-4">
        <DynamicBreadcrumb />
        <h1 className="mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-grayscale-90">
          Kết quả phân tích đo cao
        </h1>
        <p className="mb-4 sm:mb-6 text-sm text-grayscale-60">
          Dựa vào thông tin được cung cấp, bạn có thể tham khảo
        </p>
        <div className="rounded-lg bg-white shadow-sm">
          <HeightMeasurementResult resultId={resultId} />
        </div>
      </div>
    </div>
  );
}
