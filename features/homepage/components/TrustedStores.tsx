"use client"

import { Button } from "@/components/ui/Button"
import { ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import { Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

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
    description: "Đã đăng và chuyên sâu",
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
    <div className="space-y-8">
      {/* Trusted Stores Section */}
      <section className="rounded-lg bg-primary-5 p-6">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Các cửa hàng uy tín của Elela</h2>
            <Button
              variant="link"
              className="flex items-center gap-1 text-white hover:text-white/90"
            >
              Xem tất cả
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-white/80">
            Tổng hợp các cửa hàng được người dùng tin dùng và đánh giá cao
          </p>
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
              <div className="flex items-center gap-4 rounded-lg bg-white p-4">
                <Image
                  src={store.image || "/placeholder.svg"}
                  alt={store.name}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-medium text-grayscale-90">{store.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning-5 text-warning-5" />
                    <span className="font-medium text-grayscale-90">{store.rating}</span>
                    <span className="text-sm text-grayscale-50">({store.reviews} đánh giá)</span>
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
          <div key={benefit.id} className="flex items-center gap-4 rounded-lg bg-primary-5/5 p-4">
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
