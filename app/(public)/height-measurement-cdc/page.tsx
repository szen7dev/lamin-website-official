import type { Metadata } from 'next';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';
import HeightMeasurementCDCForm from '@/features/height-measurement/components/HeightMeasurementCDCForm';

export const metadata: Metadata = generateSeoMetadata({
  title: 'Đo Cao CDC',
  description: 'Công cụ đo và dự đoán chiều cao cho trẻ theo CDC',
});

export default function HeightMeasurementPage() {
  return (
    <div className="min-h-screen bg-white pb-8 sm:pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-[700px] mx-auto">
          {/* Breadcrumb */}
          <DynamicBreadcrumb />

          {/* Title Section */}
          <div className="mb-4 sm:mb-6">
            <h1 className="mb-1 sm:mb-2 text-xl sm:text-[28px] font-bold text-grayscale-90">
              Hướng dẫn chiều cao
            </h1>
            <p className="text-sm sm:text-base text-[#6C757D]">
              Hãy nhập thông tin dưới đây để nhận phân tích chi tiết
            </p>
          </div>

          {/* Form Section */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm border">
            <HeightMeasurementCDCForm />
          </div>
        </div>
      </div>
    </div>
  );
}
