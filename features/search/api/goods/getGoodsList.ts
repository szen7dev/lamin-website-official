import { Goods, GoodsListParams } from '@/features/search/types/goodsTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getGoodsList = async (
  params: GoodsListParams = {},
): Promise<Goods[]> => {
  try {
    const populatesObject = {
      path: 'parent project category userUpdate convert images thumbnail',
      populate: {
        path: 'author',
        select: 'fullname bizfullname image name slug',
      },
    };

    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      usage: 2,
      populates: JSON.stringify(populatesObject),
      isListParentOfListChilds: 1,
      ...params,
    };

    // The apiClient.get method now handles response normalization internally
    // It will automatically extract listRecords from any level of nesting
    const goods = await apiClient.getNormalizedResponse<Goods[]>(
      '/api/item/goods',
      queryParams,
    );

    return goods || [];
  } catch (error) {
    console.error('Error fetching goods list:', error);

    return [];
  }
};
