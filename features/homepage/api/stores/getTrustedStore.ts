import { TrustedStore, GetTrustedStoreParams } from '../../types/storeTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches trusted store data from the API
 * @param params Query parameters for the API request
 * @returns Array of trusted stores
 */
export const getTrustedStore = async (
  params: GetTrustedStoreParams = {},
): Promise<TrustedStore[]> => {
  // Set default parameters if not provided
  const queryParams = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    select: params.select ?? 'name sign location address rating numberOfRating',
  };

  // Fetch trusted store data from API
  const trustedStore = await apiClient.get<TrustedStore[]>(
    '/api/item/fundas',
    queryParams,
  );

  // Return the response data or empty array if no data
  return trustedStore || [];
};
