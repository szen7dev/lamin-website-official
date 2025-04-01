'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ArticleListParams } from '../types/articleTypes';
import { getArticleProperty } from '../api/getArticleProperty';

/**
 * Custom hook to fetch article list data
 * @param params Query parameters for the API request
 * @returns Article list data and loading state
 */
export function useGetArticleProperty(params: ArticleListParams = {}) {
  const {
    data: result,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_ARTICLE_PROPERTY', params],
    queryFn: () => getArticleProperty(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    articlesProperty: result || [],
    isLoading,
    error,
  };
}
