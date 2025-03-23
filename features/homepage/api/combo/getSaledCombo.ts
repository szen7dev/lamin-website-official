import { Combo, GetSaledComboParams } from '../../types/comboTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches saled combo products from the API
 * @param params Query parameters for the API request
 * @returns Array of combo products
 */
export const getSaledCombo = async (
  params: GetSaledComboParams = {},
): Promise<Combo[]> => {
  // Set default parameters if not provided
  const queryParams = {
    limit: params.limit ?? 1,
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    status: params.status ?? 1,
    populates: JSON.stringify(
      params.populates ?? {
        path: 'products',
        select: 'name sign unit sellingUnitprice listedUnitprice expired',
        populate: {
          path: 'thumbnail',
          select: 'path',
        },
      },
    ),
  };

  try {
    // Fetch combo data from API
    const combos = await apiClient.get<Combo[]>('/api/crm/combo', queryParams);

    // The apiClient.get method now handles response normalization internally
    return combos || [];
  } catch (error) {
    console.error('Error fetching saled combos:', error);

    return [];
  }
};
