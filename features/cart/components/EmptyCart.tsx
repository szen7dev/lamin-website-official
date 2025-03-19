import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function EmptyCart() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4">
      {/* Back button */}
      <div className="mb-8 self-start">
        <Link
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
          href="/">
          <ChevronLeft className="h-5 w-5" />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>

      {/* Empty cart illustration */}
      <div className="mb-6 w-48">
        <Image
          alt="Giỏ hàng trống"
          className="w-full"
          height={200}
          src="/placeholder.svg?height=200&width=200"
          width={200}
        />
      </div>

      {/* Empty cart message */}
      <h2 className="mb-2 text-lg font-medium text-gray-900">
        Bạn chưa có sản phẩm nào trong giỏ
      </h2>
      <p className="mb-6 text-center text-gray-600">
        Cùng khám phá hàng ngàn sản phẩm tại Nhà thuốc Elela Long Châu nhé!
      </p>

      {/* Explore button */}
      <Button
        asChild
        className="rounded-full bg-blue-600 px-8 hover:bg-blue-700">
        <Link href="/">Khám phá ngay</Link>
      </Button>
    </div>
  );
}
