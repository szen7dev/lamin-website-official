import {
  Article,
  ArticleListParams,
} from '@/features/article/types/articleTypes';
import {
  fetchStorePostsBrowser,
  toArticle,
} from '@/features/article/api/storeArticles';
import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getHealthNews = async (
  params: ArticleListParams = {},
): Promise<Article[]> => {
  // Nguồn mới: s7-data-hub (tính năng #4). `null` = gian hàng chưa cấu hình / s7 không với tới được →
  // rơi về nguồn cũ api.trixgo.com bên dưới.
  const s7 = await fetchStorePostsBrowser({ limit: params.limit ?? 5 });
  if (s7) return s7.map(toArticle);

  const queryParams = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    limit: params.limit ?? 5,
    populates: JSON.stringify({
      path: 'author category thumbnail',
      select: '_id name fullname image path size',
    }),
  };

  const response = await apiClient.get<Article[]>('/api/medias', queryParams);

  return response.data || [];
};
