"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const leftSlides = [
  {
    id: 1,
    image: "/images/Banner 2 1.png",
    alt: "Pharmaton Kiddi promotion 20% off",
  },
  {
    id: 2,
    image: "/images/Banner 2 1.png",
    alt: "Pharmaton Kiddi promotion special offer",
  },
  // Add more slides as needed
]

const promotions = [
  {
    id: 1,
    title: "HỖ TRỢ TĂNG CƯỜNG SỨC KHỎE GIÚP XƯƠNG CHẮC KHỎE",
    discount: "20%",
    originalPrice: "169.000đ",
    salePrice: "135.200đ",
    unit: "Hộp",
    productImage: "/placeholder.svg?height=300&width=200",
    buttonText: "MUA NGAY",
  },
  {
    id: 2,
    title: "THỦ CỦ ĐỔI MỚI",
    subPromotions: [
      {
        id: "a",
        text: "XỊT MEN SUYỄN",
        price: "5.000đ",
      },
      {
        id: "b",
        text: "BÚT TIÊM TIỂU ĐƯỜNG",
        price: "15.000đ",
      },
    ],
    mainPromotion: {
      title: "CALCI EXTRA",
      subtitle: "CHO XƯƠNG CHẮC KHỎE MỖI NGÀY",
      discount: "25%",
      image: "/placeholder.svg?height=300&width=400",
    },
  },
]

export default function GridBanner() {
  return (
    <div className="flex gap-5 justify-between">
      {/* Left Side - Sliding Banner */}
      <div className="relative rounded-lg overflow-hidden md:w-[60%]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          loop
          className="aspect-[2/1] h-full w-full"
        >
          {leftSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.alt}
                  fill
                  className="object-fit"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right Side - Static Grid */}
      <div className="w-full md:w-[40%] flex flex-col gap-4">
        {/* Top image */}
        <div className="relative w-full h-full">
          <Image
            src="/images/Banner 4 1.png"
            alt="Top right image"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>

        {/* Bottom image */}
        <div className="relative w-full h-full">
          <Image
            src="/images/Banner 3 1.png"
            alt="Bottom right image"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  )
}
