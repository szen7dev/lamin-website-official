import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import HeightMeasurementResult from '@/features/height-measurement/components/HeightMeasurementResult';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    name?: string;
  };
}

export const metadata: Metadata = generateSeoMetadata({
  title: 'Lamin-Chi tiết thông tin đo cao',
  description: 'Xem kết quả đo cao và nhận tư vấn về chiều cao',
});

export default async function HeightMeasurementHistoryPage({
  params,
  searchParams,
}: PageProps) {
  const resultId = (await Promise.resolve(params)).id;

  // Get the name from the search params
  const name = (await Promise.resolve(searchParams))?.name || 'Nguyễn Văn B';

  // Validate required parameter
  if (!resultId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-8 sm:pb-12">
      <h1 className="mb-1 sm:mb-2 text-xl sm:text-2xl font-bold text-grayscale-90">
        Chi tiết thông tin đo cao
      </h1>
      <p className="mb-4 sm:mb-6 text-sm text-grayscale-60">
        Đánh giá và phân tích chi tiết đo cao của bé {name}
      </p>
      <div className="rounded-md bg-white shadow-sm">
        <HeightMeasurementResult resultId={resultId} />
      </div>
    </div>
  );
}
