import { News, GetNewsParams } from '../../types/newsTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches health news data from the API
 * @param params Query parameters for the API request
 * @returns Array of news articles
 */
export const getHealthNews = async (
  params: GetNewsParams = {},
): Promise<News[]> => {
  // Set default parameters if not provided
  const queryParams = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    limit: params.limit ?? 5,
    populates: JSON.stringify({
      path: 'author category thumbnail',
      select: '_id name fullname image path size',
    }),
  };

  // Fetch news data from API
  const news = await apiClient.getNormalizedResponse<News[]>(
    '/api/medias',
    queryParams,
  );

  // Return the response data or empty array if no data
  return news || [];
};
