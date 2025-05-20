'use client';

import { useQuery } from '@tanstack/react-query';

import { getGoodsList } from '@/features/search/api/goods/getGoodsList';
import { GoodsListParams } from '@/features/search/types/goodsTypes';

export const useGetGoodsList = (params: GoodsListParams = {}) => {
  const {
    data: result,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['GOODS_LIST', params],
    queryFn: () => getGoodsList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled:
      !!params.keyword ||
      !!params.categoryID ||
      !!params.menuSlug ||
      !!params.lastestID,
  });

  return {
    goodsList: result?.data || [],
    pagination: result?.pagination,
    isLoading,
    error,
    refetch,
    hasResults: (result?.data || []).length > 0,
  };
};
