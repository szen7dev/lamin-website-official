import { Doctype, DoctypeParams } from '@/features/doctype/types/doctype';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getDoctype = async (params: DoctypeParams): Promise<Doctype[]> => {
  try {
    const queryParams = {
      type: params.type,
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
    };

    const response = await apiClient.get<Doctype[]>(
      `/api/item/doctypes`,
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching doctype:', error);

    return [];
  }
};
