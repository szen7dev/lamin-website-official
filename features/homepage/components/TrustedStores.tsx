'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Star, ChevronRight, AlertCircle, ChevronLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';

import { useGetTrustedStore } from '../hooks/stores/useGetTrustedStore';

import { Button } from '@/components/ui/button';
import {
  ClockIcon,
  PillIcon,
  ShieldIcon,
  StoreIcon,
  CarIcon,
} from '@/components/icons';

const benefits = [
  {
    id: 1,
    icon: <PillIcon />,
    title: 'Thuốc chính hãng',
    description: 'Đa dạng và chuyên sâu',
  },
  {
    id: 2,
    icon: <ClockIcon />,
    title: 'Đổi trả trong 30 ngày',
    description: 'Kể từ ngày mua hàng',
  },
  {
    id: 3,
    icon: <ShieldIcon />,
    title: 'Cam kết 100%',
    description: 'Chất lượng sản phẩm',
  },
  {
    id: 4,
    icon: <CarIcon />,
    title: 'Miễn phí vận chuyển',
    description: 'Theo chính sách giao hàng',
  },
];

export default function TrustedStores() {
  const { trustedStore, isLoading, error } = useGetTrustedStore();

  // Loading skeleton UI
  const renderLoadingSkeleton = () => (
    <section
      aria-labelledby="trusted-stores-heading"
      className="rounded-2xl bg-gradient-3 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex flex-col justify-between gap-2 sm:gap-3">
          <div className="h-8 w-48 bg-white/20 rounded-md animate-pulse" />
          <div className="h-4 w-64 bg-white/20 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/20 rounded-md animate-pulse" />
      </div>
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex-shrink-0 w-full max-w-xs rounded-xl bg-white/10 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-white/20 rounded-md mb-2" />
                    <div className="h-4 w-24 bg-white/20 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // Error UI
  const renderError = () => (
    <section
      aria-labelledby="trusted-stores-heading"
      className="rounded-2xl bg-gradient-3 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex flex-col justify-between gap-2 sm:gap-3">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-white"
            id="trusted-stores-heading">
            Nhà thuốc uy tín
          </h2>
          <p className="text-sm sm:text-base text-white/80">
            Mua thuốc tại các nhà thuốc uy tín trên toàn quốc
          </p>
        </div>
        <Link href="/stores">
          <Button
            className="bg-white text-primary-50 hover:bg-white/90 hover:text-primary-60"
            size="sm">
            Xem tất cả
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center p-8 rounded-xl bg-white/10">
        <div className="text-center text-white">
          <AlertCircle className="mx-auto h-10 w-10 mb-2" />
          <p className="text-lg font-medium">Không thể tải dữ liệu</p>
          <p className="text-sm text-white/80 mt-1">Vui lòng thử lại sau</p>
        </div>
      </div>
    </section>
  );

  const swiperRef = useRef<SwiperClass | null>(null);

  const [slidesPerView, setSlidesPerView] = useState(4);

  const handleSwiper = (swiper: SwiperClass) => {
    swiperRef.current = swiper;

    const updateNavState = () => {
      setSlidesPerView(swiper.params.slidesPerView as number);
    };

    updateNavState();
    swiper.on('slideChange', updateNavState);
    swiper.on('resize', updateNavState);

    swiper.on('breakpoint', () => {
      setTimeout(() => {
        setSlidesPerView(swiper.params.slidesPerView as number);
      }, 50);
    });
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Trusted Stores Section */}
      {isLoading ? (
        renderLoadingSkeleton()
      ) : error ? (
        renderError()
      ) : (
        <section
          aria-labelledby="trusted-stores-heading"
          className="rounded-2xl bg-gradient-3 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <div className="flex flex-col justify-between gap-2 sm:gap-3">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-semibold text-white"
                id="trusted-stores-heading">
                Các cửa hàng uy tín của Elela
              </h2>
              <p className="text-sm sm:text-base text-grayscale-5">
                Tổng hợp các cửa hàng được người dùng tin dùng và đánh giá cao
              </p>
            </div>
            <Button
              aria-label="Xem tất cả cửa hàng"
              className="hidden sm:flex rounded-full bg-white items-center gap-1 text-primary text-sm font-normal decoration-transparent hover:bg-white/90"
              variant="link">
              Xem tất cả
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <Swiper
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="trusted-stores-swiper"
              // modules={[Navigation]}
              modules={[Navigation, Pagination, Autoplay]}
              pagination={{
                clickable: true,
                bulletActiveClass: 'bg-primary opacity-100',
                bulletClass:
                  'inline-block w-2 h-2 rounded-full bg-grayscale-30 opacity-70 mx-1 cursor-pointer transition-all',
              }}
              slidesPerView={1}
              spaceBetween={8}
              onSwiper={handleSwiper}>
              {trustedStore && trustedStore.length > 0 ? (
                trustedStore.map(store => (
                  <SwiperSlide key={store._id}>
                    <article className="flex items-center gap-3 sm:gap-4 rounded-xl bg-white p-3 sm:p-4">
                      <div className="flex items-center justify-center rounded-full bg-primary-5 p-3">
                        <StoreIcon className="h-7 w-7" />
                      </div>

                      <div>
                        <p className="font-medium text-sm sm:text-base text-grayscale-90 truncate text-ellipsis overflow-hidden">
                          {store.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <div className="flex">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-xs sm:text-sm text-grayscale-90">
                              {store?.rating || 0}
                            </span>
                            <span className="font-normal text-xs sm:text-sm text-grayscale-40">
                              ({store?.numberOfRating || 0} đánh giá)
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="flex items-center justify-center h-24 rounded-xl bg-white p-4">
                    <p className="text-grayscale-50">Không có nhà thuốc nào</p>
                  </div>
                </SwiperSlide>
              )}
              {/* Custom Navigation Buttons - Refined positioning and styling */}
              {trustedStore && trustedStore.length > slidesPerView && (
                <>
                  <button
                    className="absolute top-1/2 left-1 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full z-10 hover:bg-grayscale-50/60"
                    onClick={() => swiperRef.current?.slidePrev()}>
                    <ChevronLeft className="w-5 h-5 text-white stroke-[1.5]" />
                  </button>

                  <button
                    className="absolute top-1/2 right-1 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full z-10 hover:bg-grayscale-50/60"
                    onClick={() => swiperRef.current?.slideNext()}>
                    <ChevronRight className="w-5 h-5 text-white stroke-[1.5]" />
                  </button>
                </>
              )}
            </Swiper>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {benefits.map(benefit => (
          <article
            key={benefit.id}
            className="flex items-center text-left gap-3">
            <div className="rounded-full bg-primary-5 p-2 sm:p-3">
              <div className="flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 text-primary-40">
                {benefit.icon}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base text-grayscale-90">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-grayscale-50">
                {benefit.description}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
