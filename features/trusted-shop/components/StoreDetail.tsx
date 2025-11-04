import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { apiClient } from '@/services/api/apiClient';
import { MiniStoreIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

interface StoreDetailProps {
  store: any;
  isLoading: boolean;
  error?: Error | null;
}

export function StoreDetail({ store, isLoading }: StoreDetailProps) {
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
    <>
      {isLoading ? (
        <div className="w-full bg-white">
          <div className="container py-12 h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* Store Image Skeleton */}
              <div className="w-full">
                <Skeleton className="h-full w-full rounded-2xl" />
              </div>

              {/* Store Info Skeleton - Right Column */}
              <div className="w-full flex flex-col justify-between">
                {/* Top Section - Store Details Skeleton */}
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>

                {/* Middle Section - Store Description Skeleton */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-24 w-full" />
                </div>

                {/* Bottom Section - Contact Buttons Skeleton */}
                <div>
                  <div className="flex gap-4">
                    <Skeleton className="h-12 flex-1 rounded-full" />
                    <Skeleton className="h-12 flex-1 rounded-full" />
                  </div>
                </div>
              </div>
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
                    sizes="(max-width: 768px) 100vw, 50vw"
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
                    {store.location && (() => {
                      const coords = store.location
                        .split(',')
                        .map((coord: string) => parseFloat(coord.trim()));
                      if (
                        coords.length === 2 &&
                        !isNaN(coords[0]) &&
                        !isNaN(coords[1])
                      ) {
                        return (
                          <Link
                            className="flex-1 px-6 h-12 inline-flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-dark transition-colors decoration-transparent"
                            href={`https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}&zoom=16`}
                            rel="noopener noreferrer"
                            target="_blank">
                            <span className="w-max">Xem chỉ đường</span>
                          </Link>
                        );
                      }
                    })()}
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
    </>
  );
}
