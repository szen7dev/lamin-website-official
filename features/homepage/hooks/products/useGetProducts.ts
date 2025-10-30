'use client';

import type { Goods } from '@/features/search/types/goodsTypes';

import { useQuery } from '@tanstack/react-query';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

interface ProductsParams {
  limit?: number;
  usage?: number;
  optionSeller?: number;
}

export function useGetProducts(params: ProductsParams = {}) {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_PRODUCTS', params.usage, params.limit],
    queryFn: async () => {
      try {
        const queryParams = {
          limit: params.limit || 6,
          usage: params.usage || 2,
          optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
          select: 'name slug thumbnail sellingUnitprice listedUnitprice',
          populates: JSON.stringify({ path: 'thumbnail', select: 'path' }),
        };

        const response = await apiClient.get<Goods[]>(
          '/api/item/goods',
          queryParams,
        );

        return response.data || [];
      } catch (error) {
        console.error('Error fetching products:', error);

        return [];
      }
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    products,
    isLoading,
    error,
  };
}
