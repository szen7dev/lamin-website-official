'use client';

import { useQuery } from '@tanstack/react-query';

import { getGoodsInfo } from '@/features/product/api/getGoodsInfo';
import { Product } from '@/features/product/types/productTypes';

/**
 * Hook for fetching detailed goods info by ID
 * @param goodsId - ID of the goods to fetch
 * @returns Object containing goods info, loading state, and error
 */
export const useGetGoodsInfo = (goodsId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GOODS_INFO', goodsId],
    queryFn: () => getGoodsInfo(goodsId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!goodsId, // Only fetch if goodsId is provided
  });

  return {
    productInfo: data as Product,
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
};
