import type {
  SearchKeyword,
  UpdateSearchKeywordParams,
} from '@/features/search/types/searchKeywordTypes';

import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Update search keyword by incrementing its count
 * @param keyword - The keyword to update
 * @param optionSeller - Option seller ID
 * @returns Updated search keyword
 */
export const updateSearchKeyword = async (
  keyword: string,
  optionSeller: number = DEFAULT_OPTION_SELLER,
): Promise<SearchKeyword | null> => {
  try {
    const params: UpdateSearchKeywordParams = {
      keyword,
      optionSeller,
    };

    const response = await apiClient.put<SearchKeyword>(
      '/api/crm/search_keyword',
      params,
    );

    return response.data;
  } catch (error) {
    console.error('Error updating search keyword:', error);

    return null;
  }
};
