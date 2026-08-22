import { Article, ArticleListParams } from '../types/articleTypes';

import { fetchStorePostsBrowser, toArticle } from './storeArticles';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getArticleList = async (
  params: ArticleListParams = {},
): Promise<Article[]> => {
  // Nguồn mới: s7-data-hub (tính năng #4). `null` = gian hàng chưa cấu hình / s7 không với tới được →
  // rơi về nguồn cũ api.trixgo.com bên dưới, đúng công tắc đã dùng cho sản phẩm (tính năng #2).
  const s7 = await fetchStorePostsBrowser({ limit: params.limit });
  if (s7) return s7.map(toArticle);

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
