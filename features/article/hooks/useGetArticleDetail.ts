'use client';

import { useQuery } from '@tanstack/react-query';

import { getArticleDetail } from '../api/getArticleDetail';
import { ArticleDetailParams } from '../types/articleTypes';

export function useGetArticleDetail(params: ArticleDetailParams) {
  const {
    data: article,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['GET_ARTICLE_DETAIL', params.slug, params.optionSeller],
    queryFn: () => getArticleDetail(params),
    staleTime: 1000 * 60 * 5,
    enabled: !!params.slug,
  });

  return {
    article,
    isLoading,
    error,
  };
}
