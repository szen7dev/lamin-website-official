'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const leftSlides = [
  {
    id: 1,
    image: '/images/Banner 2 1.png',
    alt: 'Pharmaton Kiddi promotion 20% off',
  },
  {
    id: 2,
    image: '/images/Banner 2 1.png',
    alt: 'Pharmaton Kiddi promotion special offer',
  },
  // Add more slides as needed
]

export default function GridBanner() {
  return (
    <div className="flex gap-5 justify-between">
      {/* Left Side - Sliding Banner */}
      <div className="relative rounded-lg overflow-hidden md:w-[60%]">
        <Swiper
          loop
          navigation
          className="aspect-[2/1] h-full w-full"
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}>
          {leftSlides.map(slide => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full">
                <Image
                  fill
                  alt={slide.alt}
                  className="object-fit"
                  src={slide.image || '/placeholder.svg'}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right Side - Static Grid */}
      <div className="hidden w-full md:w-[40%] md:flex flex-col gap-4">
        {/* Top image */}
        <div className="relative w-full h-full">
          <Image
            alt="Top right image"
            className="w-full h-auto rounded-lg object-cover"
            height={400}
            src="/images/Banner 4 1.png"
            width={600}
          />
        </div>

        {/* Bottom image */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            alt="Bottom right image"
            className="w-full h-auto rounded-lg object-cover"
            height={400}
            src="/images/Banner 3 1.png"
            width={600}
          />
        </div>
      </div>
    </div>
  )
}
