'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { isAfter } from 'date-fns';

import { useGetSaledCombo } from '../hooks/combo/useGetSaledCombo';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { apiClient } from '@/services/api/apiClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks';
import { ComboProduct } from '../types/comboTypes';

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
          <Image
            alt="Flame"
            height={20}
            src="/images/FireIcon.webp"
            width={20}
          />
        )}
        <span className="text-xs font-medium text-white">Đang bán chạy</span>
      </div>
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer({ expiredDate }: { expiredDate: Date | undefined }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time
      const now = new Date();

      if (!expiredDate) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });

        return;
      }

      // Parse dates to ensure they're in the same format
      // If expiredDate is already a Date object, this will create a new Date from its value
      // If it's a string (from API), this will parse it correctly
      const expirationDate = new Date(expiredDate);

      // Calculate time difference in milliseconds
      const difference = expirationDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });

        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [expiredDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div
      aria-label="Thời gian còn lại"
      className="flex items-center gap-2 text-white">
      <span className="flex h-8 w-8 items-center justify-center rounded bg-[#FF6B00] text-base font-medium">
        {formatNumber(timeLeft.hours)}
      </span>
      <span className="text-lg">:</span>
      <span className="flex h-8 w-8 items-center justify-center rounded bg-[#FF6B00] text-base font-medium">
        {formatNumber(timeLeft.minutes)}
      </span>
      <span className="text-lg">:</span>
      <span className="flex h-8 w-8 items-center justify-center rounded bg-[#FF6B00] text-base font-medium">
        {formatNumber(timeLeft.seconds)}
      </span>
    </div>
  );
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('vi-VN').format(price) + 'đ';

export default function DealSlider() {
  // Initialize with false to avoid hydration mismatch
  const [isDesktop, setIsDesktop] = useState(false);
  const isDesktopQuery = useMediaQuery('(min-width: 768px)');

  // Fetch combo data from API
  const {
    addItem,
    showCartDropdown,
    hideCartDropdown,
    isLoading: isAddingToCart,
  } = useCart();
  const { combos, isLoading } = useGetSaledCombo();
  const productsCombo = combos?.[0]?.products || [];
  const expiredDate = combos?.[0]?.expired;

  // Access toast functionality
  const { toast } = useToast();

  // Only update the state on the client after initial render
  useEffect(() => {
    setIsDesktop(isDesktopQuery);
  }, [isDesktopQuery]);

  const mobileDeals = productsCombo?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <section className="rounded-xl overflow-hidden bg-gradient-1 p-4">
        <div className="flex justify-center items-center h-40">
          <p className="text-white">Đang tải sản phẩm...</p>
        </div>
      </section>
    );
  }

  if (combos?.length === 0) {
    return <></>;
  }

  if (expiredDate && isAfter(new Date(), expiredDate)) {
    return null;
  }

  const handleAddToCart = (product: ComboProduct) => {
    // Check if the promotion has expired
    if (expiredDate) {
      const now = new Date();
      const expirationDate = new Date(expiredDate);

      if (expirationDate.getTime() <= now.getTime()) {
        // Show toast message for expired promotion
        toast({
          title: 'Thông báo',
          description: 'Sản phẩm này đã hết khuyến mại, vui lòng thử lại sau',
          variant: 'destructive',
        });

        return;
      }
    }

    // If not expired, add product to cart
    if (!product) {
      toast({
        title: 'Lỗi khi thêm vào giỏ hàng',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
        variant: 'destructive',
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    try {
      addItem({
        id: `${product._id}`,
        name: product.name || '',
        slug: product.slug,
        price: product?.sellingUnitprice || 0,
        originalPrice: product?.listedUnitprice || 0,
        salesoff:
          (product?.listedUnitprice ?? 0) - (product?.sellingUnitprice ?? 0),
        quantity: 1,
        unit: product.unit || '',
        image: product.thumbnail?.path || '',
        category: {
          _id: product.category?._id || '',
          name: product.category?.name || '',
          slug: product.category?.slug || '',
        },
      });

      toast({
        title: 'Thêm vào giỏ hàng thành công',
        description: `Sản phẩm đã được thêm vào giỏ hàng.`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Lỗi khi thêm vào giỏ hàng',
        description: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    showCartDropdown();
    setTimeout(() => {
      hideCartDropdown();
    }, 3000);
  };

  return (
    <section
      aria-labelledby="deals-heading"
      className="rounded-xl overflow-hidden bg-gradient-primary p-4 my-4 sm:my-6">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="flex items-center gap-1 text-xl sm:text-[28px] font-bold text-white mr-2"
            id="deals-heading">
            Săn
            <span className="text-warning-50">⚡</span>
            Deal
          </h2>
          <CountdownTimer expiredDate={expiredDate} />
        </div>
        {/* <Link
          aria-label="Xem thêm sản phẩm khuyến mãi"
          className="hidden md:flex items-center justify-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-white/90 decoration-transparent"
          href="/deals">
          Xem thêm
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link> */}
      </header>

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
          {productsCombo.map(product => {
            const discountAmount =
              product?.listedUnitprice && product?.sellingUnitprice
                ? Number(
                    (
                      ((product.listedUnitprice - product.sellingUnitprice) /
                        product.listedUnitprice) *
                      100
                    ).toFixed(0),
                  )
                : 0;
            const thumbnailUrl = product.thumbnail
              ? apiClient.getFileUrl(product.thumbnail.path)
              : '/placeholder.svg';
            const soldProgress = 80;

            return (
              <SwiperSlide key={product._id}>
                <article className="rounded-xl bg-white overflow-hidden relative">
                  <div className="relative">
                    {discountAmount > 0 && (
                      <div className="absolute top-0 left-0 z-10">
                        <div className="bg-gradient-5 text-white text-xs font-medium px-2 py-1 rounded-tl-xl rounded-br-xl">
                          {`-${discountAmount}%`}
                        </div>
                      </div>
                    )}
                    <Link
                      className="no-underline decoration-transparent"
                      href={{
                        pathname: `/san-pham/${product.slug}`,
                      }}>
                      <div className="aspect-square">
                        <Image
                          alt={product.name || 'San pham'}
                          className="h-full w-full object-contain"
                          height={200}
                          src={thumbnailUrl}
                          width={200}
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="p-3">
                    <Link
                      className="no-underline decoration-transparent"
                      href={{
                        pathname: `/san-pham/${product.slug}`,
                      }}>
                      <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-grayscale-90">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.sellingUnitprice)}
                        </span>
                        <span className="text-xs text-grayscale-50">
                          /{product.unit}
                        </span>
                      </div>

                      <span className="text-xs sm:text-sm text-grayscale-40 line-through h-[1.25rem] block">
                        {product?.listedUnitprice && discountAmount > 0 ? (
                          formatPrice(product?.listedUnitprice)
                        ) : (
                          <span className="opacity-0">0đ</span>
                        )}
                      </span>
                    </div>

                    <div className="mb-3">
                      <ProgressBar height="h-6" progress={soldProgress} />
                    </div>

                    <Button
                      className="mt-auto w-full rounded-full bg-primary hover:bg-primary-60 text-white py-2 px-4 text-center text-sm sm:text-base font-medium transition-colors"
                      onClick={() => handleAddToCart(product)}>
                      {isAddingToCart ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang thêm...
                        </>
                      ) : (
                        'Chọn mua'
                      )}
                    </Button>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <div className="space-y-3">
          {mobileDeals.map(product => {
            const discountAmount =
              product?.listedUnitprice && product?.sellingUnitprice
                ? Number(
                    (
                      ((product.listedUnitprice - product.sellingUnitprice) /
                        product.listedUnitprice) *
                      100
                    ).toFixed(0),
                  )
                : 0;
            const thumbnailUrl = product.thumbnail
              ? apiClient.getFileUrl(product.thumbnail.path)
              : '/placeholder.svg';
            const soldProgress = Math.floor(Math.random() * 40) + 60;

            return (
              <article
                key={product._id}
                className="relative rounded-lg bg-white overflow-hidden">
                {discountAmount > 0 && (
                  <div className="absolute top-0 left-0 z-10">
                    <div className="bg-gradient-5 text-white text-xs font-medium px-2 py-1 rounded-tl-xl rounded-br-xl">
                      {`-${discountAmount}%`}
                    </div>
                  </div>
                )}

                <div className="p-3 pt-6">
                  <div className="flex">
                    <div className="w-1/3 self-start">
                      <Link
                        className="no-underline decoration-transparent"
                        href={{
                          pathname: `/san-pham/${product.slug}`,
                        }}>
                        <div className="aspect-square w-full">
                          <Image
                            alt={product.name || 'San pham'}
                            className="h-full w-full object-contain"
                            height={200}
                            src={thumbnailUrl}
                            width={200}
                          />
                        </div>
                      </Link>
                    </div>

                    <div className="flex flex-col pl-3 w-2/3">
                      <Link
                        className="no-underline decoration-transparent"
                        href={{
                          pathname: `/san-pham/${product.slug}`,
                        }}>
                        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-grayscale-90">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mb-2 flex items-baseline gap-2">
                        <div className="flex items-baseline">
                          <span className="text-base font-bold text-primary">
                            {formatPrice(product.sellingUnitprice)}
                          </span>
                          <span className="text-xs text-grayscale-50">
                            /{product.unit}
                          </span>
                        </div>
                        {product?.listedUnitprice && discountAmount > 0 ? (
                          <span className="text-xs sm:text-sm text-grayscale-40 line-through h-[1.25rem] block">
                            {formatPrice(product?.listedUnitprice)}
                          </span>
                        ) : (
                          <span className="text-xs sm:text-sm text-grayscale-40 line-through h-[1.25rem] block opacity-0">
                            0đ
                          </span>
                        )}
                      </div>

                      <div className="mb-2">
                        <ProgressBar height="h-7" progress={soldProgress} />
                      </div>

                      <Button
                        className="mt-auto w-full rounded-full bg-primary hover:bg-primary-60 text-white py-2 px-4 text-center text-sm sm:text-base font-medium transition-colors"
                        onClick={() => handleAddToCart(product)}>
                        {isAddingToCart ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang thêm...
                          </>
                        ) : (
                          'Chọn mua'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="pt-2 flex justify-center">
            <Link
              aria-label="Xem tất cả sản phẩm khuyến mãi"
              className="flex items-center justify-center gap-1 text-white decoration-transparent"
              href="/deals">
              Xem tất cả
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
