"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { Star, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"

const stores = [
  {
    id: 1,
    name: "Cửa hàng 1",
    rating: 5.0,
    reviews: 80,
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 2,
    name: "Cửa hàng 2",
    rating: 5.0,
    reviews: 75,
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 3,
    name: "Cửa hàng 3",
    rating: 5.0,
    reviews: 62,
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 4,
    name: "Cửa hàng 4",
    rating: 5.0,
    reviews: 88,
    image: "/placeholder.svg?height=48&width=48",
  },
]

const benefits = [
  {
    id: 1,
    icon: "shield",
    title: "Thuốc chính hãng",
    description: "Đa dạng và chuyên sâu",
  },
  {
    id: 2,
    icon: "refresh",
    title: "Đổi trả trong 30 ngày",
    description: "Kể từ ngày mua hàng",
  },
  {
    id: 3,
    icon: "check-circle",
    title: "Cam kết 100%",
    description: "Chất lượng sản phẩm",
  },
  {
    id: 4,
    icon: "truck",
    title: "Miễn phí vận chuyển",
    description: "Theo chính sách giao hàng",
  },
]

export default function TrustedStores() {
  return (
    <div className="space-y-12">
      {/* Trusted Stores Section */}
      <section className="rounded-2xl bg-gradient-3 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col justify-between gap-3">
            <h2 className="text-3xl font-semibold text-white">Các cửa hàng uy tín của Elela</h2>
            <p className="text-base text-grayscale-5">
              Tổng hợp các cửa hàng được người dùng tin dùng và đánh giá cao
            </p>
          </div>
          <Button
            variant="link"
            className="flex rounded-full bg-white items-center gap-1 text-primary-5 hover:text-white/90 text-sm font-normal"
          >
            Xem tất cả
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="trusted-stores-slider"
        >
          {stores.map((store) => (
            <SwiperSlide key={store.id}>
              <div className="flex items-center gap-4 rounded-xl bg-white p-4">
                <Image
                  src={store.image || "/placeholder.svg"}
                  alt={store.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium text-xl text-grayscale-90">{store.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#FFB200] text-[#FFB200]" />
                    <span className="font-normal text-grayscale-90">{store.rating}</span>
                    <span className="font-normal text-sm text-grayscale-40">
                      ({store.reviews} đánh giá)
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center gap-4">
            <div className="rounded-full bg-primary-5/10 p-3">
              <Image
                src={`/placeholder.svg?height=24&width=24`}
                alt={benefit.title}
                width={24}
                height={24}
                className="text-primary-40"
              />
            </div>
            <div>
              <h3 className="font-medium text-grayscale-90">{benefit.title}</h3>
              <p className="text-sm text-grayscale-50">{benefit.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
