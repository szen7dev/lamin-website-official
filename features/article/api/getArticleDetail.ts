import { Article } from '../types/articleTypes';

import { Populate } from '@/types';
import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Parameters for fetching article detail
 */
export interface ArticleDetailParams {
  slug: string;
  optionSeller?: number;
  select?: string;
  populates?: Populate;
}

/**
 * Get article detail by slug
 * @param params Parameters containing slug and optionSeller
 * @returns Article detail or null if not found
 */
export const getArticleDetail = async (
  params: ArticleDetailParams,
): Promise<Article | null> => {
  try {
    if (!params.slug) {
      console.error('Slug is required for fetching article detail');

      return null;
    }

    const queryParams = {
      slug: params.slug,
      optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
      populates: params.populates
        ? JSON.stringify(params.populates)
        : JSON.stringify({ path: 'thumbnail', select: 'path' }),
    };

    const response = await apiClient.get<Article[] | Article>(
      '/api/medias',
      queryParams,
    );

    // Handle different response formats
    if (Array.isArray(response)) {
      return response.length > 0 ? response[0] : null;
    }

    // If response is a single object
    if (response && typeof response === 'object') {
      return response as Article;
    }

    return null;
  } catch (error) {
    console.error('Error fetching article detail:', error);

    return null;
  }
};
