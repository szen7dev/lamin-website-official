import {
  Article,
  ArticleListParams,
} from '@/features/article/types/articleTypes';
import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getHealthNews = async (
  params: ArticleListParams = {},
): Promise<Article[]> => {
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
