import { ArticleListParams, ArticleProperty } from '../types/articleTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Parameters for fetching article list
 */
/**
 * Get list of articles
 * @param params Query parameters for fetching articles
 * @returns List of articles
 */
export const getArticleProperty = async (
  params: ArticleListParams = {},
): Promise<ArticleProperty[]> => {
  try {
    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      ...(params.menuSlug && { menuSlug: params.menuSlug }),
    };

    // The apiClient.get method handles response normalization internally
    // It will automatically extract listRecords from any level of nesting
    const articlesProperty = await apiClient.getNormalizedResponse<
      ArticleProperty[]
    >('/api/medias/get-list-by-property', queryParams);

    return articlesProperty;
  } catch (error) {
    console.error('Error fetching article list:', error);

    return [];
  }
};
