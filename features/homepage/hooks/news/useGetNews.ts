'use client';

import { useQuery } from '@tanstack/react-query';

import { getHealthNews } from '../../api/news/getHealthNews';

import { ArticleListParams } from '@/features/article/types/articleTypes';

export const useGetNews = (params: ArticleListParams = {}) => {
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
