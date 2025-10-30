import { TrustedStore, GetTrustedStoreParams } from '../../types/storeTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getTrustedStore = async (
  params: GetTrustedStoreParams = {},
): Promise<{
  trustedStore: TrustedStore[] | TrustedStore;
  pagination: any;
}> => {
  try {
    const queryParams = {
      optionSeller: DEFAULT_OPTION_SELLER,
      select:
        params.select || 'name sign location address rating numberOfRating phone',
      option: 1,
      ...(params.populates && {
        populates: Array.isArray(params.populates)
          ? JSON.stringify(params.populates)
          : JSON.stringify([params.populates]),
      }),
      ...(params.fundaID && { fundaID: params.fundaID }),
      ...(params.limit && { limit: params.limit }),
      ...(params.lastestID && { lastestID: params.lastestID }),
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.internal && { internal: params.internal }),
    };

    const { data: trustedStore, pagination } = await apiClient.get<
      TrustedStore[] | TrustedStore
    >('/api/item/fundas', queryParams);

    return { trustedStore, pagination };
  } catch (error) {
    console.error('Error fetching trusted store data:', error);
    throw error;
  }
};
