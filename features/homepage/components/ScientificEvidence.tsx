'use client';

import { useGetArticleTagList } from '@/features/article/hooks/useGetArticleTagList';
import { apiClient } from '@/services';
import Image from 'next/image';
import Link from 'next/link';

export default function ScientificEvidence() {
  const { articlesTags: evidenceArticlesList } = useGetArticleTagList({
    limit: 3,
    optionSeller: 1,
    categoryID: '68fae257b227610012c6e0cf',
  });

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      {/* Header - Within Container */}
      <div className="container mx-auto px-4 mb-8 md:mb-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0052A4] mb-4">
              Bằng chứng khoa học của LaminGrow
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-[800px] mx-auto">
              Đội ngũ các nhà khoa học từ Viện Hàn lâm Khoa học và Công nghệ
              Việt Nam, Trường Đại học Y-Dược ĐHQG Hà Nội cùng nghiên cứu tạo ra
              sản phẩm LaminGrow
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 2xl:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {evidenceArticlesList.map((article, index) => (
            <Link
              href={`/bai-viet/${article.slug}`}
              key={index}
              className="group relative aspect-[6/4] w-full overflow-visible cursor-pointer">
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <Image
                  fill
                  priority
                  alt={article.description}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, (max-width: 1440px) 33vw, 480px"
                  src={apiClient.getFileUrl(article.thumbnail.path)}
                />
              </div>

              <div className="h-full w-full" />

              <div className="z-50 pointer-events-none absolute left-5 bottom-20 w-full translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-[calc(100%+8px)] transition-all duration-300">
                <div className="w-[85%] bg-[#0052A4] text-white rounded-xl shadow-lg p-4 md:p-5 opacity-80">
                  <p className="text-sm md:text-base text-white">
                    {article.category?.name}
                  </p>
                  <h3 className="mt-2 text-base md:text-lg font-semibold leading-snug line-clamp-4">
                    {article.title}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-2 text-white">
                    <span className="text-sm md:text-base">Xem thêm</span>
                    <span aria-hidden>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
