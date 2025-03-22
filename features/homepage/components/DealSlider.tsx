'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import { ChevronRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';

// Define the deal type for better type safety
interface Deal {
  id: number;
  image: string;
  name: string;
  originalPrice: string;
  salePrice: string;
  unit: string;
  discount: string;
  isBestSeller: boolean;
  soldProgress: number; // percentage of stock sold (0-100)
  slug: string;
}

// Progress Bar Component
function ProgressBar({
  progress,
  height = 'h-8',
  showFlame = true,
}: {
  progress: number;
  height?: string;
  showFlame?: boolean;
}) {
  return (
    <div
      className={`relative ${height} w-full overflow-hidden rounded-full bg-error-10`}>
      {/* Progress bar fill - Using inline style for dynamic width */}
      <div
        aria-label={`Đã bán ${progress}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        className="absolute left-0 top-0 h-full bg-error transition-all duration-500"
        role="progressbar"
        style={{ width: `${progress}%` }}
      />

      {/* Text overlay */}
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center gap-1 px-2">
        {showFlame && (
          <Flame
            aria-hidden="true"
            className={`${height === 'h-7' ? 'h-3 w-3' : 'h-4 w-4'} text-white`}
          />
        )}
        <span className="text-xs font-medium text-white">Đang bán chạy</span>
      </div>
    </div>
  );
}

const deals: Deal[] = [
  {
    id: 1,
    image: '/placeholder.svg?height=200&width=200',
    name: 'Hỗn hợp Vitamin D3 King Phar bổ sung Canxi, giúp xương chắc khỏe',
    originalPrice: '200.000đ',
    salePrice: '100.000đ',
    unit: 'Hộp',
    discount: '-50%',
    isBestSeller: true,
    soldProgress: 75, // percentage of stock sold
    slug: 'vien-uong-nutrigrow-nutrimed-bo-sung-canxi-vitamin-d3',
  },
  {
    id: 2,
    image: '/placeholder.svg?height=200&width=200',
    name: 'Hỗn hợp Vitamin D3 King Phar bổ sung Canxi, giúp xương chắc khỏe',
    originalPrice: '200.000đ',
    salePrice: '100.000đ',
    unit: 'Hộp',
    discount: '-50%',
    isBestSeller: true,
    soldProgress: 85,
    slug: 'vien-uong-rama-bo-phoi-ho-tro-bo-phoi-giam-ho-hieu-qua',
  },
  {
    id: 3,
    image: '/placeholder.svg?height=200&width=200',
    name: 'Hỗn hợp Vitamin D3 King Phar bổ sung Canxi, giúp xương chắc khỏe',
    originalPrice: '200.000đ',
    salePrice: '100.000đ',
    unit: 'Hộp',
    discount: '-50%',
    isBestSeller: true,
    soldProgress: 65,
    slug: 'vien-uong-nutrigrow-nutrimed-bo-sung-canxi-vitamin-d3-3',
  },
  {
    id: 4,
    image: '/placeholder.svg?height=200&width=200',
    name: 'Hỗn hợp Vitamin D3 King Phar bổ sung Canxi, giúp xương chắc khỏe',
    originalPrice: '200.000đ',
    salePrice: '100.000đ',
    unit: 'Hộp',
    discount: '-50%',
    isBestSeller: true,
    soldProgress: 90,
    slug: 'vien-uong-nutrigrow-nutrimed-bo-sung-canxi-vitamin-d3-4',
  },
  {
    id: 5,
    image: '/placeholder.svg?height=200&width=200',
    name: 'Hỗn hợp Vitamin D3 King Phar bổ sung Canxi, giúp xương chắc khỏe',
    originalPrice: '200.000đ',
    salePrice: '100.000đ',
    unit: 'Hộp',
    discount: '-50%',
    isBestSeller: true,
    soldProgress: 55,
    slug: 'vien-uong-nutrigrow-nutrimed-bo-sung-canxi-vitamin-d3-5',
  },
];

export default function DealSlider() {
  // Initialize with false to avoid hydration mismatch
  const [isDesktop, setIsDesktop] = useState(false);
  const isDesktopQuery = useMediaQuery('(min-width: 768px)');

  // Only update the state on the client after initial render
  useEffect(() => {
    setIsDesktop(isDesktopQuery);
  }, [isDesktopQuery]);

  // Only show first 3 deals on mobile
  const mobileDeals = deals.slice(0, 3);

  return (
    <section
      aria-labelledby="deals-heading"
      className="rounded-xl overflow-hidden bg-gradient-1 p-4">
      {/* Header - Same for both mobile and desktop */}
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="flex items-center gap-1 text-xl font-bold text-white"
            id="deals-heading">
            Săn
            <span className="text-warning-50">⚡</span>
            Deal
          </h2>
          <div
            aria-label="Thời gian còn lại"
            className="flex items-center gap-2 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#FF6B00] text-base font-medium">
              24
            </span>
            <span className="text-lg">:</span>
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#FF6B00] text-base font-medium">
              12
            </span>
            <span className="text-lg">:</span>
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#FF6B00] text-base font-medium">
              10
            </span>
          </div>
        </div>
        <Link
          aria-label="Xem thêm sản phẩm khuyến mãi"
          className="hidden md:flex items-center justify-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-white/90"
          href="/deals">
          Xem thêm
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </header>

      {/* Desktop View - Horizontal Slider */}
      {isDesktop ? (
        <Swiper
          aria-label="Sản phẩm khuyến mãi"
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 16,
            },
          }}
          className="deal-slider"
          grid={{
            rows: 1,
            fill: 'row',
          }}
          modules={[Navigation, Grid]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          slidesPerView={3}
          spaceBetween={16}>
          {deals.map(deal => (
            <SwiperSlide key={deal.id}>
              <article className="rounded-lg bg-white overflow-hidden">
                {/* Product Image with Discount Tag */}
                <div className="relative">
                  <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-error px-2 py-1 text-xs font-medium text-white">
                    {deal.discount}
                  </span>
                  <div className="aspect-square">
                    <Image
                      alt={deal.name}
                      className="h-full w-full object-contain"
                      height={200}
                      src={deal.image || '/placeholder.svg'}
                      width={200}
                    />
                  </div>
                </div>

                <div className="p-3">
                  {/* Product Info */}
                  <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-grayscale-90">
                    {deal.name}
                  </h3>

                  {/* Price Info */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-primary">
                        {deal.salePrice}
                      </span>
                      <span className="text-xs text-grayscale-50">
                        /{deal.unit}
                      </span>
                    </div>
                    <p className="text-xs text-grayscale-40 line-through">
                      {deal.originalPrice}
                    </p>
                  </div>

                  {/* Best Seller Badge with Progress Bar */}
                  {deal.isBestSeller && (
                    <div className="mb-3">
                      <ProgressBar progress={deal.soldProgress} />
                    </div>
                  )}

                  {/* Buy Button */}
                  <Link
                    className="block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-white hover:bg-primary-60"
                    href={{
                      pathname: `/product/${deal.slug}`,
                      query: { goodsId: deal.id },
                    }}>
                    Chọn Mua
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        /* Mobile View - Vertical List with Horizontal Cards */
        <div className="space-y-3">
          {mobileDeals.map(deal => (
            <article
              key={deal.id}
              className="relative rounded-lg bg-white overflow-hidden">
              {/* Discount Tag - Positioned outside the padding area */}
              <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-error px-2 py-1 text-xs font-medium text-white">
                {deal.discount}
              </span>

              <div className="p-3 pt-6">
                <div className="flex">
                  {/* Product Image */}
                  <div className="w-1/3 self-start">
                    <div className="aspect-square w-full">
                      <Image
                        alt={deal.name}
                        className="h-full w-full object-contain"
                        height={100}
                        src={deal.image || '/placeholder.svg'}
                        width={100}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col pl-3 w-2/3">
                    {/* Product Info */}
                    <h3 className="mb-1 line-clamp-2 text-sm font-medium text-grayscale-90">
                      {deal.name}
                    </h3>

                    {/* Price Info - On the same line */}
                    <div className="mb-2 flex items-baseline gap-2">
                      <div className="flex items-baseline">
                        <span className="text-base font-bold text-primary">
                          {deal.salePrice}
                        </span>
                        <span className="text-xs text-grayscale-50">
                          /{deal.unit}
                        </span>
                      </div>
                      <span className="text-xs text-grayscale-40 line-through">
                        {deal.originalPrice}
                      </span>
                    </div>

                    {/* Best Seller Badge with Progress Bar */}
                    {deal.isBestSeller && (
                      <div className="mb-2">
                        <ProgressBar
                          height="h-7"
                          progress={deal.soldProgress}
                        />
                      </div>
                    )}

                    {/* Buy Button */}
                    <Link
                      className="block w-full rounded-md bg-primary py-1.5 text-center text-sm font-medium text-white hover:bg-primary-60"
                      href={{
                        pathname: `/product/${deal.slug}`,
                        query: { goodsId: deal.id },
                      }}>
                      Chọn Mua
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Mobile View More Button */}
          <div className="pt-2 flex justify-center">
            <Link
              aria-label="Xem tất cả sản phẩm khuyến mãi"
              className="flex items-center justify-center gap-1 text-white"
              href="/deals">
              Xem tất cả
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Custom navigation buttons for desktop */}
      <div className="swiper-button-prev !hidden md:!flex" />
      <div className="swiper-button-next !hidden md:!flex" />
    </section>
  );
}
