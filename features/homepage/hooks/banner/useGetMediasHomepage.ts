'use client';

import type { BannerQueryParams } from '@/services/media/bannerService';

import { useQuery } from '@tanstack/react-query';

import { getMediasHomepage } from '../../api/banner/getMediasHomepage';

/**
 * Custom hook để lấy dữ liệu banner cho trang chủ
 * @returns Danh sách banner và trạng thái loading
 */
export function useGetMediasHomepage(params: BannerQueryParams) {
  const {
    data: banners,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_HOMEPAGE_BANNER', params],
    queryFn: () => getMediasHomepage(params),
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  return {
    banners,
    isLoading,
    error,
  };
}
