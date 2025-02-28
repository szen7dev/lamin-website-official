"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Client Component for interactive deal slider with countdown
export default function DealSlider() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0,
  })

  // Placeholder deals data
  const deals = [
    {
      id: 1,
      name: "Vitamin C 1000mg",
      originalPrice: 350000,
      salePrice: 280000,
      discount: 20,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/vitamin-c-1000mg",
    },
    {
      id: 2,
      name: "Omega 3 Fish Oil",
      originalPrice: 420000,
      salePrice: 315000,
      discount: 25,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/omega-3-fish-oil",
    },
    {
      id: 3,
      name: "Collagen Peptides",
      originalPrice: 550000,
      salePrice: 385000,
      discount: 30,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/collagen-peptides",
    },
    {
      id: 4,
      name: "Probiotics 50 Billion CFU",
      originalPrice: 480000,
      salePrice: 384000,
      discount: 20,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/probiotics-50-billion",
    },
    {
      id: 5,
      name: "Zinc + Vitamin C",
      originalPrice: 280000,
      salePrice: 196000,
      discount: 30,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/zinc-vitamin-c",
    },
    {
      id: 6,
      name: "Calcium + Vitamin D3",
      originalPrice: 320000,
      salePrice: 256000,
      discount: 20,
      image: "/placeholder.svg?height=300&width=300",
      link: "/product/calcium-vitamin-d3",
    },
  ]

  // Format price with VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          // Reset timer when it reaches zero
          return { hours: 5, minutes: 30, seconds: 0 }
        }

        let newHours = prev.hours
        let newMinutes = prev.minutes
        let newSeconds = prev.seconds - 1

        if (newSeconds < 0) {
          newSeconds = 59
          newMinutes -= 1
        }

        if (newMinutes < 0) {
          newMinutes = 59
          newHours -= 1
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative">
      {/* Countdown timer */}
      <div className="flex items-center justify-center mb-6 bg-primary-50 py-3 rounded-lg">
        <Clock className="h-5 w-5 text-primary-600 mr-2" />
        <span className="text-primary-700 font-semibold">Kết thúc sau:</span>
        <div className="flex items-center ml-3">
          <div className="bg-primary-600 text-white px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, "0")}</div>
          <span className="mx-1 text-primary-600">:</span>
          <div className="bg-primary-600 text-white px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, "0")}</div>
          <span className="mx-1 text-primary-600">:</span>
          <div className="bg-primary-600 text-white px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, "0")}</div>
        </div>
      </div>

      {/* Deals slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
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
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
      >
        {deals.map((deal) => (
          <SwiperSlide key={deal.id}>
            <Link
              href={deal.link}
              className="block border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full">
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{deal.discount}%
                </div>
                <Image src={deal.image || "/placeholder.svg"} alt={deal.name} fill className="object-contain p-4" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{deal.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold">{formatPrice(deal.salePrice)}</span>
                  <span className="text-gray-400 text-sm line-through">{formatPrice(deal.originalPrice)}</span>
                </div>
              </div>
              <div className="bg-primary-600 text-white text-center py-2 font-semibold">MUA NGAY</div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors">
        <ChevronLeft className="h-6 w-6 text-primary-600" />
      </button>
      <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors">
        <ChevronRight className="h-6 w-6 text-primary-600" />
      </button>
    </div>
  )
}

