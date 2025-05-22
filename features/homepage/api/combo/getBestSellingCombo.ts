import { ComboProduct, GetSaledComboParams } from '../../types/comboTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getBestSellingCombo = async (
  params: GetSaledComboParams = {},
): Promise<ComboProduct[]> => {
  const queryParams = {
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    select:
      'name sign unit sellingUnitprice listedUnitprice unitNote slug thumbnail category quantity',
    populates: JSON.stringify(
      params.populates ?? {
        path: 'thumbnail category',
        select: 'path name slug',
      },
    ),
  };

  try {
    const response = await apiClient.get<ComboProduct[]>(
      '/api/crm/combo/best-seller',
      queryParams,
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching best selling combos:', error);

    return [];
  }
};
