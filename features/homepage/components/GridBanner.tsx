'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Swiper as SwiperClass } from 'swiper';

import { useGetMediasHomepage } from '../hooks/banner/useGetMediasHomepage';

import { apiClient } from '@/services/api/apiClient';
import { Skeleton } from '@/components/ui/skeleton';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function GridBanner() {
  const { banners: leftSlides } = useGetMediasHomepage({
    type: 2,
  });

  const { banners: rightSlides } = useGetMediasHomepage({
    type: 3,
  });

  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
        {/* Left Side - Sliding Banner */}
        <div className="relative rounded-lg overflow-hidden md:col-span-3 shadow-08 group h-full">
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="h-full"
            loop={(leftSlides?.length || 0) > 1}
            modules={[Navigation, Pagination, Autoplay]}
            pagination={{
              bulletActiveClass: 'bg-primary opacity-100',
              bulletClass:
                'inline-block w-2 h-2 rounded-full bg-grayscale-30 opacity-70 mx-1 cursor-pointer transition-all',
              clickable: true,
            }}
            onSwiper={swiper => (swiperRef.current = swiper)}>
            {leftSlides?.map((slide, index) => (
              <SwiperSlide key={slide._id} className="relative h-full">
                {slide.thumbnail?.path ? (
                  <Image
                    fill
                    alt={slide.name}
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    src={apiClient.getFileUrl(slide.thumbnail.path)}
                  />
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </SwiperSlide>
            ))}
            {/* Custom Navigation Buttons - Refined positioning and styling */}
            {(leftSlides?.length || 0) > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-grayscale-50/60"
                  onClick={() => swiperRef.current?.slidePrev()}>
                  <ChevronLeft className="w-7 h-7 text-white stroke-[1.5]" />
                </button>

                <button
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 hover:bg-grayscale-50/60"
                  onClick={() => swiperRef.current?.slideNext()}>
                  <ChevronRight className="w-7 h-7 text-white stroke-[1.5]" />
                </button>
              </>
            )}
          </Swiper>
        </div>

        {/* Right Side - Static Grid */}
        <div className="hidden md:flex md:col-span-2 flex-col gap-4">
          {/* Top image - Fixed height container */}
          <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-08">
            {rightSlides?.[0]?.thumbnail?.path ? (
              <Image
                fill
                priority
                alt="Top right image"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                src={apiClient.getFileUrl(rightSlides[0].thumbnail.path)}
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>

          {/* Bottom image - Fixed height container */}
          <div className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-08">
            {rightSlides?.[1]?.thumbnail?.path ? (
              <Image
                fill
                alt="Bottom right image"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                src={apiClient.getFileUrl(rightSlides[1].thumbnail.path)}
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
