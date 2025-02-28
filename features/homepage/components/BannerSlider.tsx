'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type SwiperType from 'swiper'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Client Component for interactive slider functionality
export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  // Enhanced placeholder banner data
  const banners = [
    {
      id: 1,
      image: '/placeholder.svg?height=200&width=200',
      title: 'Khuyến mãi tháng 6 - Giảm giá đến 50%',
      description:
        'Cơ hội vàng để mua sắm các sản phẩm chăm sóc sức khỏe với giá ưu đãi',
      link: '/promotions',
      buttonText: 'Mua ngay',
      textPosition: 'left'
    },
    {
      id: 2,
      image:
        'https://img.freepik.com/free-psd/wooden-podium-product-stand-empty-display-abstract-wooden-minimal-pedestal-luxury-natural-background-product-placement-3d-rendering_56104-2175.jpg?t=st=1740694057~exp=1740697657~hmac=85aa8b74129397c4ace71de2245140a4de530c3954fcb3443716348ac86cb63d&w=1060',
      title: 'Sản phẩm mới - Bộ dưỡng da cao cấp',
      description:
        'Khám phá bộ sản phẩm dưỡng da mới nhất từ các thương hiệu hàng đầu',
      link: '/products/skincare',
      buttonText: 'Xem thêm',
      textPosition: 'center'
    },
    {
      id: 3,
      image:
        'https://plus.unsplash.com/premium_photo-1661769750859-64b5f1539aa8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdCUyMGltYWdlfGVufDB8fDB8fHww',
      title: 'Tư vấn sức khỏe miễn phí',
      description: 'Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7',
      link: '/services/health-consultation',
      buttonText: 'Đặt lịch ngay',
      textPosition: 'right'
    }
  ]

  // Progress bar animation for autoplay
  useEffect(() => {
    const startProgressAnimation = () => {
      if (progressInterval.current) clearInterval(progressInterval.current)

      setProgress(0)
      const duration = 5000 // match with autoplay delay
      const interval = 50 // update every 50ms
      const increment = (interval / duration) * 100

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0
          return prev + increment
        })
      }, interval)
    }

    if (isAutoPlaying) {
      startProgressAnimation()
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isAutoPlaying, currentSlide])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        swiperRef.current?.slidePrev()
      } else if (e.key === 'ArrowRight') {
        swiperRef.current?.slideNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className='relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg'>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect='fade'
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        pagination={{
          el: '.banner-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className} w-3 h-3 bg-white bg-opacity-50 rounded-full transition-all duration-300 hover:bg-opacity-100"></span>`
          }
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onAutoplayStart={() => setIsAutoPlaying(true)}
        onAutoplayStop={() => setIsAutoPlaying(false)}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex)
          setProgress(0)
        }}
        className='banner-swiper'
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className='relative'>
            <div className='relative h-full w-full overflow-hidden'>
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                priority={banner.id === 1}
                className='object-cover transition-transform duration-7000 hover:scale-105'
                sizes='100vw'
              />

              {/* Gradient overlay for better text visibility */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>

              {/* Content container with position variants */}
              <div
                className={`absolute inset-0 flex items-center ${
                  banner.textPosition === 'left'
                    ? 'justify-start text-left'
                    : banner.textPosition === 'right'
                    ? 'justify-end text-right'
                    : 'justify-center text-center'
                }`}
              >
                <div
                  className={`${
                    banner.textPosition === 'left'
                      ? 'ml-8 md:ml-16'
                      : banner.textPosition === 'right'
                      ? 'mr-8 md:mr-16'
                      : 'mx-auto'
                  } max-w-lg px-4`}
                >
                  <h2 className='text-3xl md:text-4xl font-bold mb-3 text-white slide-in-text'>
                    {banner.title}
                  </h2>
                  <p className='text-lg md:text-xl mb-6 text-white/90 slide-in-text delay-100'>
                    {banner.description}
                  </p>
                  <Link
                    href={banner.link}
                    className='bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 inline-flex items-center slide-in-text delay-200 hover:shadow-xl hover:-translate-y-0.5 transform'
                  >
                    {banner.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Enhanced navigation buttons */}
      <button
        className='swiper-button-prev !w-10 !h-10 md:!w-12 md:!h-12 !bg-white/80 hover:!bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 !flex items-center justify-center after:!content-[""]'
        aria-label='Previous slide'
        onClick={() => {
          swiperRef.current?.slidePrev()
          setProgress(0)
        }}
      >
        <ChevronLeft className='h-5 w-5 md:h-6 md:w-6 text-primary-600' />
      </button>
      <button
        className='swiper-button-next !w-10 !h-10 md:!w-12 md:!h-12 !bg-white/80 hover:!bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 !flex items-center justify-center after:!content-[""]'
        aria-label='Next slide'
        onClick={() => {
          swiperRef.current?.slideNext()
          setProgress(0)
        }}
      >
        <ChevronRight className='h-5 w-5 md:h-6 md:w-6 text-primary-600' />
      </button>

      {/* Custom pagination container */}
      <div className='banner-pagination absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2'></div>

      {/* Progress bar for autoplay */}
      <div className='absolute bottom-0 left-0 right-0 h-1 bg-transparent'>
        <div
          className='h-full bg-primary-600 transition-all duration-50'
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Slide counter */}
      <div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
        {currentSlide + 1}/{banners.length}
      </div>

      {/* Controls for autoplay */}
      <button
        onClick={() => {
          if (isAutoPlaying) {
            swiperRef.current?.autoplay.stop()
          } else {
            swiperRef.current?.autoplay.start()
          }
        }}
        className='absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors'
        aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z' />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            viewBox='0 0 16 16'
          >
            <path d='m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z' />
          </svg>
        )}
      </button>

      {/* CSS for animations */}
      <style jsx global>{`
        .banner-swiper .swiper-slide-active .slide-in-text {
          animation: slideInUp 0.8s forwards;
        }
        .banner-swiper .swiper-slide-active .slide-in-text.delay-100 {
          animation-delay: 0.1s;
        }
        .banner-swiper .swiper-slide-active .slide-in-text.delay-200 {
          animation-delay: 0.2s;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .swiper-pagination-bullet-active {
          background-color: white !important;
          transform: scale(1.3);
        }

        /* Responsive navigation buttons */
        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  )
}
