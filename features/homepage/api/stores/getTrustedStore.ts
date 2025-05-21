import { TrustedStore, GetTrustedStoreParams } from '../../types/storeTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches trusted store data from the API
 * @param params Query parameters for the API request
 * @returns Array of trusted stores or a single store object
 */
export const getTrustedStore = async (
  params: GetTrustedStoreParams = {},
): Promise<{
  trustedStore: TrustedStore[] | TrustedStore;
  pagination: any;
}> => {
  try {
    // Set default parameters if not provided
    const queryParams = {
      optionSeller: DEFAULT_OPTION_SELLER,
      select:
        params.select || 'name sign location address rating numberOfRating',
      option: 1,
      // Format populates parameter correctly - ensure it's an array if provided
      ...(params.populates && {
        populates: Array.isArray(params.populates)
          ? JSON.stringify(params.populates)
          : JSON.stringify([params.populates]),
      }),
      // Include fundaID if provided
      ...(params.fundaID && { fundaID: params.fundaID }),
      ...(params.limit && { limit: params.limit }),
      ...(params.lastestID && { lastestID: params.lastestID }),
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.internal && { internal: params.internal }),
    };

    // Fetch trusted store data from API
    const { data: trustedStore, pagination } = await apiClient.get<
      TrustedStore[] | TrustedStore
    >('/api/item/fundas', queryParams);

    // Return the response data
    return { trustedStore, pagination };
  } catch (error) {
    console.error('Error fetching trusted store data:', error);
    // Re-throw the error after logging it for debugging
    throw error;
  }
};
