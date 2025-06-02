import {
  ProductLot,
  ProductLotParams,
} from '@/features/doctype/types/productLot';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getProductLot = async (
  params: ProductLotParams,
): Promise<ProductLot> => {
  try {
    const queryParams = {
      sign: params.sign,
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      populates: params.populates ? JSON.stringify(params.populates) : '',
    };

    const response = await apiClient.get<ProductLot>(
      `/api/store/items`,
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching product lot:', error);

    throw error;
  }
};
