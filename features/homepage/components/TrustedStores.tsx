'use client';

import Link from 'next/link';
import { Star, ChevronRight, AlertCircle } from 'lucide-react';

import { useGetTrustedStore } from '../hooks/stores/useGetTrustedStore';

import { Button } from '@/components/ui/button';
import {
  ClockIcon,
  PillIcon,
  ShieldIcon,
  StoreIcon,
  CarIcon,
} from '@/components/icons';

const benefits = [
  {
    id: 1,
    icon: <PillIcon />,
    title: 'Sản phẩm chính hãng',
    description: 'Nguồn gốc từ Dược liệu và vi sinh',
  },
  {
    id: 2,
    icon: <ClockIcon />,
    title: 'Đổi trả trong 30 ngày',
    description: 'Kể từ ngày mua hàng',
  },
  {
    id: 3,
    icon: <ShieldIcon />,
    title: 'Cam kết sản phẩm',
    description: 'Đúng chất lượng theo công bố',
  },
  {
    id: 4,
    icon: <CarIcon />,
    title: 'Miễn phí vận chuyển',
    description: 'Theo chính sách giao hàng',
  },
];

export default function TrustedStores() {
  const { trustedStore, isLoading, error } = useGetTrustedStore({
    limit: 4,
    internal: 2,
  });

  // Loading skeleton UI
  const renderLoadingSkeleton = () => (
    <section
      aria-labelledby="trusted-stores-heading"
      className="rounded-2xl bg-gradient-primary p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex flex-col justify-between gap-2 sm:gap-3">
          <div className="h-8 w-48 bg-white/20 rounded-md animate-pulse" />
          <div className="h-4 w-64 bg-white/20 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/20 rounded-md animate-pulse" />
      </div>
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex-shrink-0 w-full max-w-xs rounded-xl bg-white/10 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-white/20 rounded-md mb-2" />
                    <div className="h-4 w-24 bg-white/20 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // Error UI
  const renderError = () => (
    <section
      aria-labelledby="trusted-stores-heading"
      className="rounded-2xl bg-gradient-primary p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="flex flex-col justify-between gap-2 sm:gap-3">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-white"
            id="trusted-stores-heading">
            Cửa hàng uy tín
          </h2>
          <p className="text-sm sm:text-base text-white/80">
            Theo danh sách được công bố tại Website lamin.com.vn
          </p>
        </div>
        <Link className="decoration-transparent" href="/stores">
          <Button
            className="bg-white text-primary-50 hover:bg-white/90 hover:text-primary-60"
            size="sm">
            Xem tất cả
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center p-8 rounded-xl bg-white/10">
        <div className="text-center text-white">
          <AlertCircle className="mx-auto h-10 w-10 mb-2" />
          <p className="text-lg font-medium">Không thể tải dữ liệu</p>
          <p className="text-sm text-white/80 mt-1">Vui lòng thử lại sau</p>
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-3 sm:space-y-6">
      {/* Trusted Stores Section */}
      {isLoading ? (
        renderLoadingSkeleton()
      ) : error ? (
        renderError()
      ) : (
        <section></section>
        // <section
        //   aria-labelledby="trusted-stores-heading"
        //   className="sm:rounded-2xl bg-gradient-primary p-3 sm:p-4 md:p-6">
        //   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        //     <div className="flex flex-col justify-between gap-2 sm:gap-3">
        //       <h2
        //         className="text-xl sm:text-2xl md:text-[28px] font-semibold text-white"
        //         id="trusted-stores-heading">
        //         Các cửa hàng uy tín của Lamin
        //       </h2>
        //       <p className="text-sm sm:text-base text-grayscale-5">
        //         Tổng hợp các cửa hàng được người dùng tin dùng và đánh giá cao
        //       </p>
        //     </div>
        //     <Link
        //       aria-label="Xem tất cả cửa hàng"
        //       className="hidden sm:flex rounded-full bg-white items-center gap-1 px-4 py-2 text-primary text-sm font-normal decoration-transparent hover:bg-white/90"
        //       href="/he-thong-cua-hang">
        //       Xem tất cả
        //       <ChevronRight aria-hidden="true" className="h-4 w-4" />
        //     </Link>
        //   </div>

        //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        //     {Array.isArray(trustedStore) && trustedStore.length > 0 ? (
        //       trustedStore.map(store => (
        //         <article
        //           key={store._id}
        //           className="flex items-center gap-3 sm:gap-4 rounded-xl bg-white p-3 sm:p-4">
        //           <div className="flex items-center justify-center rounded-full bg-primary-5 p-3">
        //             <StoreIcon className="h-7 w-7" />
        //           </div>

        //           <div className="flex-1 min-w-0">
        //             <p className="font-medium text-sm sm:text-base text-grayscale-90 truncate max-w-full">
        //               {store.name}
        //             </p>
        //             <div className="flex items-center gap-1.5">
        //               <div className="flex">
        //                 <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
        //               </div>
        //               <div className="flex items-center gap-1">
        //                 <span className="font-medium text-xs sm:text-sm text-grayscale-90">
        //                   {store?.rating || 0}
        //                 </span>
        //                 <span className="font-normal text-xs sm:text-sm text-grayscale-70">
        //                   ({store?.numberOfRating || 0} đánh giá)
        //                 </span>
        //               </div>
        //             </div>
        //           </div>
        //         </article>
        //       ))
        //     ) : (
        //       <div className="col-span-full flex items-center justify-center h-24 rounded-xl bg-white/10 p-4">
        //         <p className="text-grayscale-50">Không có cửa hàng nào</p>
        //       </div>
        //     )}
        //   </div>
        // </section>
      )}

      {/* Benefits Section */}
      <section className="grid grid-cols-2 p-4 sm:p-0 md:grid-cols-4 gap-3 sm:gap-4">
        {benefits.map(benefit => (
          <article
            key={benefit.id}
            className="flex flex-col sm:flex-row items-center text-left gap-3">
            <div className="rounded-full bg-[#d0dcf8] p-2 sm:p-3">
              <div className="flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 text-primary-40">
                {benefit.icon}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base text-grayscale-90">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-grayscale-50">
                {benefit.description}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
