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
export const getArticleTagList = async (
  params: ArticleListParams = {},
): Promise<{ data: Article[]; response: any }> => {
  try {
    const queryParams = {
      select:
        params.select ||
        'title name slug thumbnail description createdAt updatedAt',
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      populates: params.populates
        ? JSON.stringify(params.populates)
        : JSON.stringify({
            path: 'thumbnail category tags',
            select: 'path name level slug',
          }),
      ...(params.menuSlug && { menuSlug: params.menuSlug }),
      ...(params.lastestID && { lastestID: params.lastestID }),
      ...(params.limit !== undefined && { limit: params.limit }),
      ...(params.option !== undefined && { option: params.option }),
    };

    // The apiClient.get method handles response normalization internally
    // It will automatically extract listRecords from any level of nesting
    const { data: articles, response: articlesResponse } = await apiClient.get<
      Article[]
    >('/api/medias', queryParams);

    return { data: articles || [], response: articlesResponse };
  } catch (error) {
    console.error('Error fetching article list:', error);

    return { data: [], response: null };
  }
};
