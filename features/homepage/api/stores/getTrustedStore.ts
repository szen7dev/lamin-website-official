import { TrustedStore, GetTrustedStoreParams } from '../../types/storeTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches trusted store data from the API
 * @param params Query parameters for the API request
 * @returns Array of trusted stores or a single store object
 */
export const getTrustedStore = async (
  params: GetTrustedStoreParams = {},
): Promise<TrustedStore[] | TrustedStore> => {
  // Set default parameters if not provided
  const queryParams = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    select: params.select ?? 'name sign location address rating numberOfRating',
    populates: params.populates ? JSON.stringify(params.populates) : undefined,
    // Include fundaID if provided
    ...(params.fundaID && { fundaID: params.fundaID }),
  };

  // Fetch trusted store data from API
  const trustedStore = await apiClient.getNormalizedResponse<
    TrustedStore[] | TrustedStore
  >('/api/item/fundas', queryParams);

  // Return the response data
  return trustedStore;
};
