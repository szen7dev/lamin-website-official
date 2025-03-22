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

    // Handle different response structures
    if (response && typeof response === 'object') {
      // Case 1: Direct access to listRecords
      if (Array.isArray(response.listRecords)) {
        return response.listRecords;
      }

      // Case 2: Nested in data.listRecords
      if (response.data && Array.isArray(response.data.listRecords)) {
        return response.data.listRecords;
      }

      // Case 3: Nested deeply in data.data.listRecords
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.listRecords)
      ) {
        return response.data.data.listRecords;
      }

      // Case 4: Response is the array itself
      if (Array.isArray(response)) {
        return response;
      }
    }

    console.warn('Unexpected response structure from goods API:', response);

    return [];
  } catch (error) {
    console.error('Error fetching goods list:', error);

    return [];
  }
};
