'use client';

import { useQuery } from '@tanstack/react-query';

import { getBestSellers } from '@/features/menu/api/getBestSellers';
import {
  BestSellerItem,
  BestSellerParams,
} from '@/features/menu/types/bestSellerTypes';

export const BEST_SELLERS_QUERY_KEY = 'BEST_SELLERS';

export interface UseGetBestSellersOptions {
  params?: BestSellerParams;
  staleTime?: number;
  enabled?: boolean;
}

export const useGetBestSellers = (options: UseGetBestSellersOptions = {}) => {
  const {
    params = {},
    staleTime = 1000 * 60 * 5, // 5 minutes default
    enabled = true,
  } = options;

  const queryResult = useQuery<BestSellerItem[]>({
    queryKey: [BEST_SELLERS_QUERY_KEY, params],
    queryFn: () => getBestSellers(params),
    staleTime,
    enabled,
  });

  const { data: bestSellers = [] } = queryResult;

  return {
    ...queryResult,
    bestSellers,
    hasItems: bestSellers.length > 0,
    isEmpty: bestSellers.length === 0,
  };
};
