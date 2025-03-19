import type { ArticleService } from '../types/articleTypes';

import { articleMockService } from '../mocks/articleMockService';

import { articleRealService } from './articleService';

import { isMockApi } from '@/config/apiConfig';

export function getArticleService(): ArticleService {
  return isMockApi() ? articleMockService : articleRealService;
}

// Create and export the service instance
export const articleService = getArticleService();
