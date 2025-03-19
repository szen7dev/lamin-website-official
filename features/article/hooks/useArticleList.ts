'use client';

import type { ArticleListParams } from '../types/articleTypes';

import { useQuery } from '@tanstack/react-query';

import { articleService } from '../services/articleServiceFactory';

export function useArticleList(params?: ArticleListParams) {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articleService.getArticles(params),
  });
}
