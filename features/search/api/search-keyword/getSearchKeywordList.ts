import type {
  GetSearchKeywordParams,
  SearchKeyword,
} from '@/features/search/types/searchKeywordTypes';

import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Get popular search keywords
 * @param optionSeller - Option seller ID
 * @returns List of popular search keywords
 */
export const getSearchKeywordList = async (
  optionSeller: number = DEFAULT_OPTION_SELLER,
): Promise<SearchKeyword[]> => {
  try {
    const params: GetSearchKeywordParams = { optionSeller };

    // The apiClient.get method now handles response normalization internally
    // It will automatically extract listRecords from any level of nesting
    const keywords = await apiClient.getNormalizedResponse<SearchKeyword[]>(
      '/api/crm/search_keyword',
      params,
    );

    return keywords || [];
  } catch (error) {
    console.error('Error fetching search keywords:', error);

    return [];
  }
};
