'use client';

import { useQuery } from '@tanstack/react-query';

import { Product } from '@/features/product/types/productTypes';
import { getGoodsInfoBySlug } from '@/features/product/api/getGoodsInfoBySlug';

/**
 * Hook for fetching detailed goods info by slug
 * @param slug - slug of the goods to fetch
 * @returns Object containing goods info, loading state, and error
 */
export const useGetGoodsInfoBySlug = (slug: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_GOODS_INFO_BY_SLUG', slug],
    queryFn: () => getGoodsInfoBySlug(slug),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!slug, // Only fetch if slug is provided
  });

  return {
    productInfo: data as Product,
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
};
