import { Goods, GoodsListParams } from '@/features/search/types/goodsTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getGoodsList = async (
  params: GoodsListParams = {},
): Promise<{ data: Goods[]; pagination: any }> => {
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
      ...(params.menuSlug && { menuSlug: params.menuSlug }),
      ...(params.lastestID && { lastestID: params.lastestID }),
      ...(params.limit !== undefined && { limit: params.limit }),
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.categoryID && { categoryID: params.categoryID }),
      ...params,
    };

    const { data: goods, pagination } = await apiClient.get<Goods[]>(
      '/api/item/goods',
      queryParams,
    );

    return { data: goods || [], pagination };
  } catch (error) {
    console.error('Error fetching goods list:', error);

    return { data: [], pagination: null };
  }
};
