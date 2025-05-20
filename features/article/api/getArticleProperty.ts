import { ArticleListParams, ArticleProperty } from '../types/articleTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getArticleProperty = async (
  params: ArticleListParams = {},
): Promise<ArticleProperty[]> => {
  try {
    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      ...(params.menuSlug && { menuSlug: params.menuSlug }),
    };

    const articlesProperty = await apiClient.getNormalizedResponse<
      ArticleProperty[]
    >('/api/medias/get-list-by-property', queryParams);

    return articlesProperty;
  } catch (error) {
    console.error('Error fetching article list:', error);

    return [];
  }
};
