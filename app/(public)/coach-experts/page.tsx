import Image from 'next/image';
import { Suspense } from 'react';
import { Metadata } from 'next';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { CoachesList } from '@/features/coach-experts/components';
import Loading from '@/app/loading';
import { generateMetadata as generateSeoMetadata } from '@/utils/seo';

export function generateMetadata(): Metadata {
  return generateSeoMetadata({
    title: 'Đội Ngũ Chuyên Môn',
    description:
      'Cập nhật thông tin sức khỏe, dinh dưỡng và lời khuyên từ chuyên gia y tế',
    keywords: ['sức khỏe', 'dinh dưỡng', 'lời khuyên sức khỏe'],
  });
}

export default function CoachExpertsPage() {
  return (
    <section className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto">
        <DynamicBreadcrumb />
      </div>

      {/* Banner Section */}
      <section className="overflow-hidden rounded-2xl">
        <div className="relative h-[180px] w-full">
          <Image
            fill
            priority
            alt="Coach Experts Banner"
            className="object-cover"
            quality={100}
            sizes="100vw"
            src="/images/coach_pages.png"
          />
        </div>
      </section>

      {/* Info Grid Section */}
      <section className="px-20 mb-12 bg-white">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-4 p-4">
            <div className="shrink-0">
              <div className="flex items-center justify-center">
                <Image
                  alt="Experience Icon"
                  height={48}
                  src="/images/star_icon.png"
                  width={48}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-grayscale-90">
                Giàu kinh nghiệm
              </h3>
              <p className="text-sm text-grayscale-60">
                Đội ngũ chuyên gia (bác sỹ, dược sỹ) giàu kinh nghiệm trong lĩnh
                vực chăm sóc sức khỏe chủ động.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  alt="Hat Icon"
                  height={48}
                  src="/images/hat_icon.webp"
                  width={48}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-grayscale-90">
                Nghiệp vụ chuyên môn cao
              </h3>
              <p className="text-sm text-grayscale-60">
                Các bác sĩ, dược sĩ tập trung chuyên môn sâu với các giải pháp
                và sản phẩm có nguồn gốc từ dược liệu (đặc biệt là Nam dược-dược
                liệu quý tại Việt Nam) và vi sinh
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4">
            <div className="shrink-0">
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  alt="Tick Icon"
                  height={48}
                  src="/images/tick_icon.png"
                  width={48}
                />
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-grayscale-90">
                Tâm huyết và tận tâm
              </h3>
              <p className="text-sm text-grayscale-60">
                Phục vụ mà không đặt nặng quyền lợi, chỉ đơn giản là thực sự
                muốn làm điều tốt nhất cho khách hàng như chính người thân của
                mình
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic content with coaches list */}
      <Suspense fallback={<Loading />}>
        <CoachesList />
      </Suspense>
    </section>
  );
}
