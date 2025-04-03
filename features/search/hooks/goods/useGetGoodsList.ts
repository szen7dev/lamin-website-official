'use client';

import { useQuery } from '@tanstack/react-query';

import { getGoodsList } from '@/features/search/api/goods/getGoodsList';
import { GoodsListParams } from '@/features/search/types/goodsTypes';

/**
 * Hook for fetching goods list with optional search functionality
 * @param params - Query parameters for goods list, including keyword for search
 * @returns Object containing goods list, loading state, and error
 */
export const useGetGoodsList = (params: GoodsListParams = {}) => {
  const {
    data: goodsList = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['GOODS_LIST', params],
    queryFn: () => getGoodsList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.keyword || !!params.categoryID,
  });

  return {
    goodsList,
    isLoading,
    error,
    refetch,
    hasResults: goodsList.length > 0,
  };
};
