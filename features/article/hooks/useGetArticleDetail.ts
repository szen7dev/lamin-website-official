'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getArticleDetail,
  type ArticleDetailParams,
} from '../api/getArticleDetail';

/**
 * Custom hook to fetch article detail by slug
 * @param params Parameters containing slug and optionSeller
 * @returns Article detail data and loading state
 */
export function useGetArticleDetail(params: ArticleDetailParams) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_ARTICLE_DETAIL', params.slug, params.optionSeller],
    queryFn: () => getArticleDetail(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.slug, // Only run query if slug is provided
  });

  return {
    article,
    isLoading,
    error,
  };
}
