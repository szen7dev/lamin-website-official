import { Article, ArticleListParams } from '../types/articleTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Parameters for fetching article list
 */
/**
 * Get list of articles
 * @param params Query parameters for fetching articles
 * @returns List of articles
 */
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

    // The apiClient.get method handles response normalization internally
    // It will automatically extract listRecords from any level of nesting
    const articles = await apiClient.getNormalizedResponse<Article[]>(
      '/api/medias',
      queryParams,
    );

    return articles || [];
  } catch (error) {
    console.error('Error fetching article list:', error);

    return [];
  }
};
