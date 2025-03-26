'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getArticleList, type ArticleListParams } from '../api/getArticleList';

/**
 * Custom hook to fetch article list data
 * @param params Query parameters for the API request
 * @returns Article list data and loading state
 */
export function useGetArticleList(params: ArticleListParams = {}) {
  const {
    data: articles,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_ARTICLE_LIST', params],
    queryFn: () => getArticleList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    articles,
    isLoading,
    error,
  };
}
