'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useGetTestimonials } from '@/features/homepage/hooks/testimonials/useGetTestimonials';
import { apiClient } from '@/services/api/apiClient';
import { QuoteIcon } from '@/components/icons';

export default function TestimonialsSection() {
  const { testimonials, isLoading } = useGetTestimonials({
    limit: 6,
    type: 2,
    optionSeller: 1,
  });

  if (isLoading) {
    return (
      <section className="w-full bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-center">
            <div className="mx-auto mb-4 h-10 w-64 rounded bg-gray-200" />
            <div className="mx-auto mb-12 h-6 w-96 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const truncateText = (text: string, maxLength: number = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center md:mb-12 lg:mb-16">
          <h2 className="mb-3 text-[30px] font-bold text-primary">
            Hành Trình Người Thật
          </h2>
          <p className="mx-auto max-w-3xl text-[16px] font-normal leading-relaxed">
            Mỗi câu chuyện là một hành trình đồng hành – từ lo lắng đến tự tin
            <br />
            Hành trình không chỉ thay đổi số đo – mà còn thay đổi cả niềm tin
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map(testimonial => (
            <Link
              key={testimonial._id}
              className="group block cursor-pointer no-underline decoration-transparent transition-all duration-300 hover:no-underline"
              href={`/bai-viet/${testimonial.slug}`}>
              {/* Image */}
              <div className="relative aspect-[6/4] w-full overflow-hidden rounded-3xl bg-gray-200">
                {testimonial.thumbnail?.path ? (
                  <Image
                    fill
                    alt={testimonial.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={apiClient.getFileUrl(testimonial.thumbnail.path)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <span className="text-4xl text-blue-400">📷</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="mt-4">
                {/* Title - extracted name info */}
                <div className="mb-3">
                  <p className="text-base text-gray-800">
                    <span className="font-bold">{testimonial.title}</span>
                  </p>
                </div>

                {/* Quote Box */}
                {testimonial.summary && (
                  <div
                    className="rounded-2xl bg-[#eaeffb] px-6 py-6 text-gray-700 relative"
                    style={{ boxShadow: '6px 6px 0px 0px #DDE3E9' }}>
                    {/* Quote Icon */}
                    <div className="mb-3 absolute -top-2 left-4">
                      <QuoteIcon className="text-[#B8C5D6]" size={25} />
                    </div>
                    {/* Quote Text */}
                    <p className="text-sm leading-relaxed text-gray-700">
                      {truncateText(testimonial.summary, 200)}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
