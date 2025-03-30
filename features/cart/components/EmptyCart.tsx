'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function EmptyCart() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="container flex min-h-[calc(100vh-400px)] flex-col items-center ">
        {/* Back button */}
        <div className="my-8 self-start">
          <Link
            className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:no-underline decoration-transparent"
            href="/">
            <ChevronLeft className="h-5 w-5" />
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>

        {/* Empty cart illustration */}
        <div className="flex justify-center w-full">
          <Image
            priority
            alt="Giỏ hàng trống"
            height={213}
            src="/images/EmptyCart.png"
            width={400}
          />
        </div>

        {/* Empty cart message */}
        <div className="flex flex-col items-center max-w-72">
          <h2 className="mb-2 text-base font-semibold text-gray-900">
            Bạn chưa có sản phẩm nào trong giỏ
          </h2>
          <p className="mb-6 text-base text-center font-normal text-gray-600">
            Cùng khám phá hàng ngàn sản phẩm tại Nhà thuốc LAMIN nhé!
          </p>
        </div>

        {/* Explore button */}
        <Button
          asChild
          className="rounded-full bg-primary px-8 hover:bg-primary/80 min-w-44">
          <Link
            className="decoration-transparent text-white hover:no-underline"
            href="/">
            Khám phá ngay
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[calc(100vh-200px)] flex-col items-center ">
      {/* Back button */}
      <div className="my-8 self-start">
        <Link
          className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:no-underline decoration-transparent"
          href="/">
          <ChevronLeft className="h-5 w-5" />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>

      {/* Empty cart illustration */}
      <div>
        <Image
          alt="Giỏ hàng trống"
          className="h-auto w-600"
          height={600}
          src="/images/EmptyCart.png"
          width={213}
        />
      </div>

      {/* Empty cart message */}
      <h2 className="mb-2 text-lg font-medium text-gray-900">
        Bạn chưa có sản phẩm nào trong giỏ
      </h2>
      <p className="mb-6 text-center text-gray-600">
        Cùng khám phá hàng ngàn sản phẩm tại Nhà thuốc LAMIN nhé!
      </p>

      {/* Explore button */}
      <Button
        asChild
        className="rounded-full bg-blue-600 px-8 hover:bg-blue-700">
        <Link
          className="decoration-transparent text-white hover:no-underline"
          href="/">
          Khám phá ngay
        </Link>
      </Button>
    </div>
  );
}
