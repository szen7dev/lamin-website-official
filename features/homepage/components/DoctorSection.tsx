'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useGetHeroBlogLink } from '@/features/homepage/hooks/banner/useGetHeroBlogLink';

const HERO_CATEGORY_ID = '680019100d8352001f52890d';

export default function DoctorSection() {
  // Fetch the second blog post link with optimized caching
  const { blogSlug } = useGetHeroBlogLink({
    categoryID: HERO_CATEGORY_ID,
    limit: 2,
    optionSeller: 1,
    itemIndex: 1, // Get second item (index 1)
  });

  // Memoize the href to prevent unnecessary recalculations
  const blogHref = useMemo(() => {
    return blogSlug ? `/bai-viet/${blogSlug}` : '#';
  }, [blogSlug]);

  return (
    <section className="w-full relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          fill
          priority
          alt=""
          aria-hidden="true"
          className="object-cover"
          quality={90}
          sizes="100vw"
          src="/images/hero-background.png"
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 max-w-[1440px] mx-auto">
          {/* Left Content */}
          <div className="flex-shrink-0 max-w-[600px] w-full text-center">
            <p className="text-[#0052A4] text-lg md:text-xl font-semibold mb-4">
              Tiến sĩ Lê Thị Thu Hương
            </p>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-[1.4]">
              KIẾN TẠO TƯƠNG LAI NGÀNH DƯỢC VIỆT NAM TỪ NỀN TẢNG KHOA HỌC VỮNG
              CHẮC
            </h2>

            <p className="text-base md:text-lg mb-8 text-gray-700 leading-relaxed">
              Trong bối cảnh ngành dược Việt Nam đang chuyển mình mạnh mẽ, Tiến
              sĩ - Dược sĩ Lê Thị Thu Hương nổi lên như một nhà khoa học tiên
              phong, với tầm nhìn xa và sự mệnh kết nối giữa di sản y học cổ
              truyền với công nghệ sinh học hiện đại.
            </p>

            <div className="flex justify-center">
              <Link
                className="inline-block bg-[#0052A4] hover:bg-[#003d7a] text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 text-base md:text-lg"
                href={blogHref}>
                Xem thêm
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0 w-full max-w-[200px] lg:max-w-[280px]">
            <div className="relative aspect-square w-full">
              <div className="absolute inset-0 rounded-full border-[6px] border-[#00ADED] overflow-hidden">
                <Image
                  fill
                  alt="Tiến sĩ Lê Thị Thu Hương"
                  className="object-cover"
                  quality={90}
                  sizes="(max-width: 768px) 200px, 280px"
                  src="/images/hero-image-2.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
