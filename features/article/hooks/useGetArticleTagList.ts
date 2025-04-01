'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getArticleTagList } from '../api/getArticleTagList';
import { ArticleListParams } from '../types/articleTypes';

/**
 * Custom hook to fetch article list data
 * @param params Query parameters for the API request
 * @returns Article list data and loading state
 */
export function useGetArticleTagList(params: ArticleListParams = {}) {
  const {
    data: result,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_ARTICLE_TAG_LIST', params],
    queryFn: () => getArticleTagList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    articlesTags: result?.data || [],
    response: result?.response,
    isLoading,
    error,
  };
}
