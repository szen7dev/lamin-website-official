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
      <section className="px-20 mb-12 bg-[#eaeffb]">
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
                Đội ngũ bác sĩ và dược sĩ giàu kinh nghiệm có thâm niên trong
                ngành, được tư nghiệp cả trong và ngoài nước.
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
                Các bác sĩ và dược sĩ hiện đang công tác và giảng dạy tại bệnh
                viện hàng đầu cả nước, nghiệp vụ chuyên môn cao ở lĩnh vực y
                dược.
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
                Luôn sẵn sàng tư vấn và hỗ trợ chăm sóc sức khỏe cho mọi người
                bằng sự tận tâm và nhiệt huyết.
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
