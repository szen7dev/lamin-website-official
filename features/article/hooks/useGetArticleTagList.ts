'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getArticleTagList } from '../api/getArticleTagList';
import { ArticleListParams } from '../types/articleTypes';

export function useGetArticleTagList(params: ArticleListParams = {}) {
  const {
    data: result,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_ARTICLE_TAG_LIST', params],
    queryFn: () => getArticleTagList(params),
    staleTime: 1000 * 60 * 5,
  });

  return {
    articlesTags: result?.data || [],
    response: result?.response,
    isLoading,
    error,
  };
}
