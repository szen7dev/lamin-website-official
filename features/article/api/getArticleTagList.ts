import { Article, ArticleListParams } from '../types/articleTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getArticleTagList = async (
  params: ArticleListParams = {},
): Promise<{ data: Article[]; pagination: any }> => {
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
      ...(params.categoryID && { categoryID: params.categoryID }),
    };

    const { data: articles, pagination } = await apiClient.get<Article[]>(
      '/api/medias',
      queryParams,
    );

    return { data: articles || [], pagination };
  } catch (error) {
    console.error('Error fetching article list:', error);

    return { data: [], pagination: null };
  }
};
