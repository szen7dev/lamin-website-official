import { Article, ArticleDetailParams } from '../types/articleTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

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
    if (Array.isArray(response.data)) {
      return response.data.length > 0 ? response.data[0] : null;
    }

    // If response is a single object
    if (response && typeof response === 'object') {
      return response.data as Article;
    }

    return null;
  } catch (error) {
    console.error('Error fetching article detail:', error);

    return null;
  }
};
