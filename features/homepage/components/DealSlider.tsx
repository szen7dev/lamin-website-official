'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Grid } from 'swiper/modules'
import { Button } from '@/components/ui/Button'
import { ChevronRight, Flame } from 'lucide-react'

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
    <div className="rounded-2xl bg-gradient-3 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            Săn
            <span className="text-warning-5">⚡</span>
            Deal
          </h2>
          <div className="flex gap-2 text-white">
            <span className="rounded bg-primary-20 px-2 py-1">24</span>
            <span>:</span>
            <span className="rounded bg-primary-20 px-2 py-1">12</span>
            <span>:</span>
            <span className="rounded bg-primary-20 px-2 py-1">10</span>
          </div>
        </div>
        <Button
          variant="link"
          className="flex items-center gap-1 text-primary-5 bg-white rounded-full">
          Xem thêm
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Swiper
        modules={[Navigation, Grid]}
        navigation
        grid={{
          rows: 1,
          fill: 'row',
        }}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        className="deal-slider">
        {deals.map(deal => (
          <SwiperSlide key={deal.id}>
            <div className="relative rounded-xl bg-white p-4">
              {/* Product Image with Discount Tag */}
              <div className="relative mb-4 aspect-square">
                <Image
                  src={deal.image || '/placeholder.svg'}
                  alt={deal.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="absolute top-0 left-0 z-10">
                <div className="bg-gradient-5 text-white text-xs font-medium px-2 py-1 rounded-tl-xl rounded-br-xl">
                  {deal.discount}
                </div>
              </span>

              {/* Product Info */}
              <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-grayscale-90">
                {deal.name}
              </h3>

              {/* Price Info */}
              <div className="mb-2">
                <div className="flex items-center gap-1 text-primary-5">
                  <span className="text-lg font-bold ">{deal.salePrice}</span>
                  <span className="text-xs"> / {deal.unit}</span>
                </div>
                <p className="text-sm text-grayscale-40 line-through">{deal.originalPrice}</p>
              </div>

              {/* Best Seller Badge with Progress */}
              {deal.isBestSeller && (
                <div className="mb-3 space-y-1">
                  <div
                    className={`inline-flex items-center gap-1 w-full rounded-full bg-error-5 px-3 py-2 text-sm font-medium text-white shadow-sm`}>
                    <Flame className="h-4 w-4" />
                    <span>Đang bán chạy</span>
                  </div>
                </div>
              )}

              {/* Buy Button */}
              <Button className="w-full rounded-full bg-primary-5 text-white hover:bg-primary-20 text-base font-medium">
                Chọn Mua
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
