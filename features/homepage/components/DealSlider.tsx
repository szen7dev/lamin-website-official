'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Grid } from 'swiper/modules'
import { ChevronRight, Flame } from 'lucide-react'

import { Button } from '@/components/ui/Button'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'

const deals = [
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
  },
  // Add more deals as needed
]

export default function DealSlider() {
  return (
    <div className="rounded-2xl bg-gradient-3 p-3 sm:p-4">
      <header className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
          <h2 className="flex items-center gap-1 sm:gap-2 text-lg sm:text-xl font-bold text-white">
            Săn
            <span className="text-warning-5">⚡</span>
            Deal
          </h2>
          <div className="flex gap-1 sm:gap-2 text-white text-sm sm:text-base">
            <span className="rounded bg-primary-20 px-1.5 sm:px-2 py-0.5 sm:py-1">24</span>
            <span className="flex items-center">:</span>
            <span className="rounded bg-primary-20 px-1.5 sm:px-2 py-0.5 sm:py-1">12</span>
            <span className="flex items-center">:</span>
            <span className="rounded bg-primary-20 px-1.5 sm:px-2 py-0.5 sm:py-1">10</span>
          </div>
        </div>
        <Button
          className="hidden sm:flex items-center gap-1 text-primary bg-white rounded-full text-sm"
          variant="link">
          Xem thêm
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </header>

      <Swiper
        navigation
        breakpoints={{
          480: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 4,
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
        slidesPerView={2}
        spaceBetween={8}>
        {deals.map(deal => (
          <SwiperSlide key={deal.id}>
            <div className="relative rounded-xl bg-white p-2 sm:p-3 md:p-4">
              {/* Product Image with Discount Tag */}
              <div className="relative mb-2 sm:mb-3 md:mb-4 aspect-square">
                <Image
                  fill
                  alt={deal.name}
                  className="object-contain"
                  src={deal.image || '/placeholder.svg'}
                />
              </div>
              <span className="absolute top-0 left-0 z-10">
                <div className="bg-gradient-5 text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-tl-xl rounded-br-xl">
                  {deal.discount}
                </div>
              </span>

              {/* Product Info */}
              <h3 className="mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] text-xs sm:text-sm font-medium text-grayscale-90">
                {deal.name}
              </h3>

              {/* Price Info */}
              <div className="mb-1.5 sm:mb-2">
                <div className="flex items-center gap-1 text-primary">
                  <span className="text-base sm:text-lg font-bold">{deal.salePrice}</span>
                  <span className="text-[10px] sm:text-xs"> / {deal.unit}</span>
                </div>
                <p className="text-xs sm:text-sm text-grayscale-40 line-through">
                  {deal.originalPrice}
                </p>
                <p className="text-xs sm:text-sm text-grayscale-40 line-through">
                  {deal.originalPrice}
                </p>
              </div>

              {/* Best Seller Badge with Progress */}
              {deal.isBestSeller && (
                <div className="mb-2 sm:mb-3 space-y-1">
                  <div
                    className={`inline-flex items-center justify-center gap-1 w-full rounded-full bg-error px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white shadow-sm`}>
                    <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Đang bán chạy</span>
                  </div>
                </div>
              )}

              {/* Buy Button */}
              <Button className="w-full h-8 sm:h-auto rounded-full bg-primary text-white hover:bg-primary-20 text-xs sm:text-sm md:text-base font-medium">
                Chọn Mua
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Mobile View More Button */}
      <div className="mt-3 flex sm:hidden justify-center">
        <Button
          className="flex items-center gap-1 text-primary bg-white rounded-full text-xs"
          variant="link">
          Xem thêm
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
