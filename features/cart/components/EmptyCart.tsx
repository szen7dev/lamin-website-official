'use client';

import Image from 'next/image';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function EmptyCart() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div
      className={
        isMobile
          ? 'container flex min-h-[calc(100vh-400px)] flex-col items-center'
          : 'container flex min-h-[calc(100vh-200px)] flex-col items-center'
      }>
      <div className={isMobile ? 'flex justify-center w-full' : undefined}>
        <Image
          alt="Giỏ hàng trống"
          className={isMobile ? undefined : 'h-auto w-600'}
          height={isMobile ? 213 : 600}
          priority={isMobile}
          src="/images/EmptyCart.webp"
          width={isMobile ? 400 : 213}
        />
      </div>
      <div
        className={
          isMobile ? 'flex flex-col items-center max-w-72' : undefined
        }>
        <h2
          className={
            isMobile
              ? 'mb-2 text-base font-semibold text-gray-900'
              : 'mb-2 text-lg font-medium text-gray-900'
          }>
          Bạn chưa có sản phẩm nào trong giỏ
        </h2>
        <p
          className={
            isMobile
              ? 'mb-6 text-base text-center font-normal text-gray-600'
              : 'mb-6 text-center text-gray-600'
          }>
          Cùng khám phá các sản phẩm tại LAMIN nhé
        </p>
      </div>
    </div>
  );
}
