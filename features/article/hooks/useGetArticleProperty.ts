'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ArticleListParams } from '../types/articleTypes';
import { getArticleProperty } from '../api/getArticleProperty';

export function useGetArticleProperty(params: ArticleListParams = {}) {
  const {
    data: result,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_ARTICLE_PROPERTY', params],
    queryFn: () => getArticleProperty(params),
    staleTime: 1000 * 60 * 5,
  });

  return {
    articlesProperty: result || [],
    isLoading,
    error,
  };
}
