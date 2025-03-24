import { Area, GetAreaListParams } from '../types/areaTypes';

import apiClient from '@/services/api/apiClient';

/**
 * Fetch area list with search functionality
 *
 * @param params - Query parameters including keyword
 * @returns Area response with list of matching areas
 */
export const getAreaList = async (
  params: GetAreaListParams = {},
): Promise<Area[]> => {
  try {
    const populatesObject = {
      path: 'parent',
      select: 'name sign parent level',
      populate: { path: 'parent', select: 'name sign parent level' },
    };

    const queryParams = {
      keyword: params.keyword,
      populates: JSON.stringify(populatesObject),
      ...params,
    };

    // Make the API request
    const response = await apiClient.get<Area[]>(
      '/api/item/areas',
      queryParams,
    );

    return response;
  } catch (error) {
    console.error('Error fetching area list:', error);

    // Return error response
    return [];
  }
};
