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
    };

    // Fetch trusted store data from API
    const trustedStore = await apiClient.getNormalizedResponse<
      TrustedStore[] | TrustedStore
    >('/api/item/fundas', queryParams, false); // Set requireAuth to false

    // Return the response data
    return trustedStore;
  } catch (error) {
    console.error('Error fetching trusted store data:', error);
    // Re-throw the error after logging it for debugging
    throw error;
  }
};
