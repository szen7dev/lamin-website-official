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
    const response = await apiClient.get<any>(
      '/api/crm/search_keyword',
      params,
    );

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
    console.error('Error fetching search keywords:', error);

    return [];
  }
};
