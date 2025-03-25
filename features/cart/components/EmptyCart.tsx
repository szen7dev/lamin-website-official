import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function EmptyCart() {
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
