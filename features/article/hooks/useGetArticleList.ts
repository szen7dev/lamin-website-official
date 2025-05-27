'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getArticleList } from '../api/getArticleList';
import { ArticleListParams } from '../types/articleTypes';

export function useGetArticleList(params: ArticleListParams = {}) {
  const {
    data: articles,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_ARTICLE_LIST', params],
    queryFn: () => getArticleList(params),
    staleTime: 1000 * 60 * 5,
  });

  return {
    articles,
    isLoading,
    error,
  };
}
