import { ComboProduct, GetSaledComboParams } from '../../types/comboTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches best selling combo products from the API
 * @param params Query parameters for the API request
 * @returns Array of combo products
 */
export const getBestSellingCombo = async (
  params: GetSaledComboParams = {},
): Promise<ComboProduct[]> => {
  // Set default parameters if not provided
  const queryParams = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    select: 'name sign unit sellingUnitprice listedUnitprice unitNote slug',
    populates: JSON.stringify(
      params.populates ?? {
        path: 'thumbnail',
        select: 'path',
      },
    ),
  };

  try {
    // Fetch combo data from API
    const combos = await apiClient.get<ComboProduct[]>(
      '/api/crm/combo/best-seller',
      queryParams,
    );

    // The apiClient.get method now handles response normalization internally
    return combos || [];
  } catch (error) {
    console.error('Error fetching best selling combos:', error);

    return [];
  }
};
