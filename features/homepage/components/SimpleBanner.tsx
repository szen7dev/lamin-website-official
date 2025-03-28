'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useGetMediasHomepage } from '../hooks/banner/useGetMediasHomepage';

import { apiClient } from '@/services/api/apiClient';
import { Skeleton } from '@/components/ui/skeleton';

export default function SimpleBanner() {
  const { banners, isLoading } = useGetMediasHomepage({
    type: 1,
    limit: 1,
  });

  // Fallback image nếu API chưa trả về dữ liệu hoặc có lỗi
  const fallbackImageUrl =
    'https://cdn.nhathuoclongchau.com.vn/unsafe/828x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/1610x492_Banner_WEB_f660825f26.png';

  const banner = banners && banners.length > 0 ? banners[0] : null;

  // Xác định URL hình ảnh từ API hoặc sử dụng fallback
  const imageUrl =
    (banner?.thumbnail?.path &&
      apiClient.getFileUrl(banner?.thumbnail?.path)) ||
    fallbackImageUrl;
  const bannerLink = banner?.link || '#';

  const BannerComponent = () => (
    <>
      {/* Desktop Banner */}
      <div className="hidden md:block w-full">
        <Image
          priority
          alt={banner?.name || 'Hero Banner'}
          className="w-full object-cover"
          height={400}
          sizes="(max-width: 1024px) 90vw, 1200px"
          src={imageUrl}
          width={1200}
        />
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden w-full">
        <Image
          alt={banner?.name || 'Hero Banner'}
          className="w-full h-[172px] object-cover"
          height={172}
          sizes="100vw"
          src={imageUrl}
          width={600}
        />
      </div>
    </>
  );

  return (
    <section className="w-full bg-background">
      {isLoading ? (
        <Skeleton className="w-full h-[400px] md:h-[300px]" />
      ) : bannerLink && bannerLink !== '#' ? (
        <Link href={bannerLink}>
          <BannerComponent />
        </Link>
      ) : (
        <BannerComponent />
      )}
    </section>
  );
}
