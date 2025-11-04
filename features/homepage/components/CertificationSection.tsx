'use client';

import { useState } from 'react';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    leftImage: '/images/paper.png',
    rightImage: '/images/company.png',
  },
  {
    id: 2,
    leftImage: '/images/paper.png',
    rightImage: '/images/company.png',
  },
];

export default function CertificationSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="w-full" style={{ backgroundColor: '#0052A4' }}>
      <div className="container mx-auto px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20">
        {/* Images Container */}
        <div className="mx-auto mb-8 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.5fr] md:gap-12 lg:gap-16 xl:gap-20">
            {/* Left Column - Title + Paper/Certificate */}
            <div className="flex flex-col">
              {/* Title */}
              <h2 className="mb-8 text-[30px] font-bold leading-tight text-white">
                Sản phẩm LaminGrow
                <br />
                được sản xuất tại Nhà máy Dược phẩm DK đạt chuẩn GMP-WHO
              </h2>

              {/* Paper/Certificate Image */}
              <div className="flex items-center justify-start">
                <div className="relative h-[400px] w-full max-w-[380px] overflow-hidden rounded-lg bg-white shadow-xl lg:h-[450px]">
                  <Image
                    fill
                    alt="Giấy chứng nhận GMP-WHO"
                    className="h-full w-full object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 380px"
                    src={slides[currentSlide].leftImage}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Company Building (wider) */}
            <div className="flex items-end justify-start">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl lg:h-[450px]">
                <Image
                  fill
                  alt="Nhà máy Dược phẩm DK"
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
                  src={slides[currentSlide].rightImage}
                  style={{ objectPosition: 'center 40%' }}
                />
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'w-8 bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                type="button"
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section with Darker Background */}
      <div
        className="w-full py-8 md:py-10 lg:py-12"
        style={{ backgroundColor: '#00427D' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:justify-between">
            {/* Text */}
            <h3 className="text-center text-[24px] font-semibold leading-relaxed text-white md:text-left">
              Sản phẩm LaminGrow được phân phối tại các Nhà thuốc uy tín
              <br />
              và nhận được tin tưởng từ khách hàng
            </h3>

            {/* Customer Satisfaction Badge */}
            <div className="flex-shrink-0">
              <Image
                alt="Customer Satisfaction"
                className="h-auto w-auto"
                height={80}
                src="/images/satisfication.png"
                width={240}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
