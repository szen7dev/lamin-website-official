import { Product } from '@/features/product/types/productTypes';
import apiClient from '@/services/api/apiClient';

export const getGoodsInfo = async (goodsId: string): Promise<Product> => {
  try {
    const populatesObject = {
      path: 'images userUpdate category company',
      select: 'path size image note fullname name slug',
      populate: { path: 'position', select: 'name' },
    };

    const queryParams = {
      populates: JSON.stringify(populatesObject),
      goodsID: goodsId,
    };

    const response = await apiClient.getNormalizedResponse<Product>(
      `/api/item/goods`,
      queryParams,
    );

    return response as Product;
  } catch (error) {
    console.error('Error fetching goods info:', error);
    throw error;
  }
};
