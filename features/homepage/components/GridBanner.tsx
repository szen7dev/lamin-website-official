'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useGetMediasHomepage } from '../hooks/banner/useGetMediasHomepage';

import { apiClient } from '@/services/api/apiClient';

export default function GridBanner() {
  const { banners: leftSlides } = useGetMediasHomepage({
    type: 2,
  });

  const { banners: rightSlides } = useGetMediasHomepage({
    type: 3,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
        {/* Left Side - Sliding Banner */}
        <div className="relative rounded-lg overflow-hidden md:col-span-3 shadow-08 group h-full">
          <Swiper
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="h-full"
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'bg-primary opacity-100',
              bulletClass:
                'inline-block w-2 h-2 rounded-full bg-grayscale-30 opacity-70 mx-1 cursor-pointer transition-all',
            }}>
            {leftSlides?.map(slide => (
              <SwiperSlide key={slide._id} className="h-full">
                <div className="relative h-full">
                  <Image
                    fill
                    priority
                    alt={slide.name}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    src={apiClient.getFileUrl(slide.thumbnail.path)}
                  />
                </div>
              </SwiperSlide>
            ))}
            {/* Custom Navigation Buttons - Refined positioning and styling */}
            <button
              aria-label="Previous slide"
              className="swiper-button-prev !hidden group-hover:!flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 items-center justify-center transition-all hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent">
              <ChevronLeft className="w-8 h-8 text-white stroke-[1.5]" />
            </button>
            <button
              aria-label="Next slide"
              className="swiper-button-next !hidden group-hover:!flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 items-center justify-center transition-all hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent">
              <ChevronRight className="w-8 h-8 text-white stroke-[1.5]" />
            </button>
          </Swiper>
        </div>

        {/* Right Side - Static Grid */}
        <div className="hidden md:flex md:col-span-2 flex-col gap-4">
          {/* Top image - Fixed height container */}
          <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-08">
            <Image
              fill
              alt="Top right image"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              src={
                rightSlides?.[0]?.thumbnail?.path
                  ? apiClient.getFileUrl(rightSlides?.[0].thumbnail.path)
                  : '/placeholder.svg'
              }
            />
          </div>

          {/* Bottom image - Fixed height container */}
          <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-08">
            <Image
              fill
              alt="Bottom right image"
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              src={
                rightSlides?.[1]?.thumbnail?.path
                  ? apiClient.getFileUrl(rightSlides?.[1].thumbnail.path)
                  : '/placeholder.svg'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
