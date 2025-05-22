'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useGetMediasHomepage } from '../hooks/banner/useGetMediasHomepage';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { apiClient } from '@/services/api/apiClient';

export default function FeatureShortcuts() {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const { banners: features = [], isLoading } = useGetMediasHomepage({
    type: 4,
  });

  const getGridCols = () => {
    const count = features.length;

    // Mobile grid columns
    if (!isDesktop) {
      if (count <= 2) return 'grid-cols-2';
      if (count <= 3) return 'grid-cols-3';

      return 'grid-cols-3'; // Default for mobile
    }

    // Desktop grid columns
    if (count <= 3) return 'md:grid-cols-3';
    if (count <= 4) return 'md:grid-cols-4';
    if (count <= 6) return 'md:grid-cols-6';
    if (count <= 8) return 'md:grid-cols-4';

    return 'md:grid-cols-6'; // Default for desktop
  };

  return (
    <nav aria-label="Truy cập nhanh" className="py-4 md:py-0 pb-4 mb-4">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-30 border-t-transparent" />
        </div>
      ) : features.length > 0 ? (
        <div className={`grid gap-3 ${getGridCols()} md:gap-4`}>
          {features.map(feature => (
            <div key={feature._id} className="flex-shrink-0">
              <Link
                className={`decoration-transparent group flex h-full rounded-xl bg-white shadow-md transition-all hover:shadow-light-08 ${
                  isDesktop
                    ? 'flex-row items-center gap-3 p-4'
                    : 'flex-col items-center gap-2 p-3'
                }`}
                href={feature.slug || '#'}>
                <div
                  className={`flex items-center justify-center ${
                    isDesktop
                      ? 'h-10 w-10 flex-shrink-0 rounded-full bg-primary-5'
                      : 'h-8 w-8 rounded-full bg-primary-5'
                  }`}>
                  {feature.thumbnail?.path ? (
                    <Image
                      alt={feature.name}
                      className="text-primary-40 transition-colors group-hover:text-primary-50"
                      height={isDesktop ? 20 : 16}
                      src={apiClient.getFileUrl(feature.thumbnail.path)}
                      width={isDesktop ? 20 : 16}
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-primary-20" />
                  )}
                </div>
                <span
                  className={`font-medium text-grayscale-70 group-hover:text-grayscale-90 ${
                    isDesktop ? 'text-sm break-words' : 'text-center text-xs'
                  }`}>
                  {feature.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-4 text-grayscale-50">
          No feature shortcuts available
        </div>
      )}
    </nav>
  );
}
