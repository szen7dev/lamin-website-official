'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const banners = [
  {
    id: 1,
    image: '/placeholder.svg?height=400&width=1200',
    alt: 'Chính bạn TOA SÁNG tặng quà ĐÓN TẾT',
  },
  {
    id: 2,
    image: '/placeholder.svg?height=400&width=1200',
    alt: 'Khuyến mãi đặc biệt',
  },
]

export default function SimpleBanner() {
  return (
    <div className="relative w-full">
      <Swiper
        loop
        navigation
        autoplay={{ delay: 5000 }}
        className="aspect-[16/5] w-full"
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}>
        {banners.map(banner => (
          <SwiperSlide key={banner.id}>
            <div className="relative h-full w-full">
              <Image
                fill
                priority
                alt={banner.alt}
                className="object-cover"
                src={banner.image || '/placeholder.svg'}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
