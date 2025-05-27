import { Article, ArticleListParams } from '../types/articleTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getArticleList = async (
  params: ArticleListParams = {},
): Promise<Article[]> => {
  try {
    const queryParams = {
      select:
        params.select || 'name slug thumbnail description createdAt updatedAt',
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      populates: params.populates
        ? JSON.stringify(params.populates)
        : JSON.stringify({ path: 'thumbnail', select: 'path' }),
    };

    const articles = await apiClient.get<Article[]>('/api/medias', queryParams);

    return articles.data || [];
  } catch (error) {
    console.error('Error fetching article list:', error);

    return [];
  }
};
