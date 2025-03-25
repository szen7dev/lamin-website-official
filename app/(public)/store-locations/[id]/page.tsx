'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';

import { useGetTrustedStore } from '@/features/homepage/hooks/stores/useGetTrustedStore';
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { apiClient } from '@/services/api/apiClient';
import { MiniStoreIcon } from '@/components/icons';

export default function StoreDetailPage() {
  const { id } = useParams();
  // Use the hook with fundaID from params
  const { singleStore: store, isLoading } = useGetTrustedStore({
    fundaID: id as string,
    populates: {
      path: 'thumbnail area3 area2 area1',
      select: 'path name',
    },
    select:
      'name sign location address rating numberOfRating description phone',
  });

  // If store is not found and not loading, return 404
  if (!isLoading && !store) {
    notFound();
  }

  // Format address
  const address = store
    ? [
        store.address,
        store?.area1?.name,
        store?.area2?.name,
        store?.area3?.name,
      ]
        .filter(Boolean)
        .join(', ') || 'Chưa có địa chỉ'
    : '';

  // Get image URL
  const imageUrl = store?.thumbnail?.path
    ? apiClient.getFileUrl(store.thumbnail.path)
    : '/placeholder.svg';

  return (
    <main className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto mb-6">
        <DynamicBreadcrumb />
      </div>

      {isLoading ? (
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-96 rounded-xl bg-gray-200 mb-6" />
            <div className="space-y-4">
              <div className="h-8 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-32 w-full rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ) : store ? (
        <div className="w-full bg-white">
          {/* Store Image and Info */}
          <div className="container py-12 h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* Store Image */}
              <div className="w-full">
                <div className="relative h-full w-full rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    fill
                    alt={store.name || 'Store image'}
                    className="object-cover"
                    src={imageUrl}
                  />
                </div>
              </div>

              {/* Store Info - Right Column */}
              <div className="w-full flex flex-col justify-between">
                {/* Top Section - Store Details */}
                <div>
                  <h1 className="text-xl font-semibold text-black mb-2">
                    {store.name}
                  </h1>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-grayscale-50">
                      {address}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-normal text-grayscale-90 mb-1">
                      <span>Điện thoại:</span>{' '}
                      <span>{store.phone || 'Chưa có số điện thoại'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-[#FFB200] text-[#FFB200]" />
                    <span className="text-sm font-medium text-grayscale-90">
                      {store.rating?.toFixed(1) || '0.0'}{' '}
                      <span className="text-primary">
                        ({store.numberOfRating || 0} đánh giá)
                      </span>
                    </span>
                  </div>
                </div>

                {/* Middle Section - Store Description */}
                <div>
                  <div className="flex items-center gap-2">
                    <MiniStoreIcon size={24} />
                    <h2 className="text-lg font-semibold text-black">
                      Mô tả chi tiết:
                    </h2>
                  </div>
                  <div className="text-base font-normal text-[#020B27]">
                    <p>{store.description || 'Không có mô tả chi tiết'}</p>
                  </div>
                </div>

                {/* Bottom Section - Contact Buttons */}
                <div>
                  <div className="flex gap-4">
                    <Link
                      className="flex-1 px-6 h-12 inline-flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-dark transition-colors decoration-transparent"
                      href={`https://maps.google.com/?q=${address}`}
                      target="_blank">
                      <span className="w-max">Xem chỉ đường</span>
                    </Link>
                    <Link
                      className="flex-1 px-6 h-12 inline-flex items-center justify-center bg-white border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors decoration-transparent"
                      href={`tel:${store.phone || '0123456789'}`}>
                      <span className="w-max">Gọi tư vấn</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto text-center py-12">
          <p className="text-grayscale-70">Không tìm thấy thông tin cửa hàng</p>
        </div>
      )}
    </main>
  );
}
