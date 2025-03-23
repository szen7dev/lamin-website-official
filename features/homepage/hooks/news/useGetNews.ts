'use client';

import { useQuery } from '@tanstack/react-query';

import { getHealthNews } from '../../api/news/getHealthNews';
import { GetNewsParams } from '../../types/newsTypes';

/**
 * Hook to fetch health news data
 * @param params Query parameters for the API request
 * @returns Query result with news data
 */
export const useGetNews = (params: GetNewsParams = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['healthNews', params],
    queryFn: () => getHealthNews(params),
  });

  return {
    news: data || [],
    isLoading,
    error,
  };
};
