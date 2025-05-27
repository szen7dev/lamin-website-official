import { Combo, GetSaledComboParams } from '../../types/comboTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getSaledCombo = async (
  params: GetSaledComboParams = {},
): Promise<Combo[]> => {
  const queryParams = {
    limit: params.limit ?? 1,
    optionSeller: params.optionSeller ?? DEFAULT_OPTION_SELLER,
    status: params.status ?? 1,
    populates: JSON.stringify(
      params.populates ?? {
        path: 'products',
        select: 'name sign unit sellingUnitprice listedUnitprice expired slug',
        populate: {
          path: 'thumbnail',
          select: 'path',
        },
      },
    ),
  };

  try {
    const response = await apiClient.get<Combo[]>(
      '/api/crm/combo',
      queryParams,
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching saled combos:', error);

    return [];
  }
};
