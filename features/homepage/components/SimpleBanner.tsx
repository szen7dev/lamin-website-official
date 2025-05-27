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

  const banner = banners && banners.length > 0 ? banners[0] : null;
  const bannerLink = banner?.slug ? banner.slug : '#';

  const BannerComponent = () => (
    <div className="w-full">
      <Image
        priority
        alt={banner?.name || 'Hero Banner'}
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIi8+"
        className="w-full object-cover md:h-auto h-[172px]"
        height={400}
        loading="eager"
        placeholder="blur"
        quality={80}
        sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1536px) 90vw, 1200px"
        src={apiClient.getFileUrl(banner?.thumbnail?.path || '')}
        width={1200}
      />
    </div>
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
