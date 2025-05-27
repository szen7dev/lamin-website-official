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

    const keywords = await apiClient.get<SearchKeyword[]>(
      '/api/crm/search_keyword',
      params,
    );

    return keywords.data || [];
  } catch (error) {
    console.error('Error fetching search keywords:', error);

    return [];
  }
};
