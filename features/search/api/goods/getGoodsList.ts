import { Goods, GoodsListParams } from '@/features/search/types/goodsTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getGoodsList = async (
  params: GoodsListParams = {},
): Promise<Goods[]> => {
  try {
    const populatesObject = {
      path: 'parent project category userUpdate convert images',
      populate: { path: 'author', select: 'fullname bizfullname image' },
    };

    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      usage: 2,
      populates: JSON.stringify(populatesObject),
      isListParentOfListChilds: 1,
      ...params,
    };

    // Our API client should already handle unwrapping data.data.listRecords
    // But let's add additional logic to be safe
    const response = await apiClient.get<any>('/api/item/goods', queryParams);

    return goods || [];
  } catch (error) {
    console.error('Error fetching goods list:', error);

    return [];
  }
};
