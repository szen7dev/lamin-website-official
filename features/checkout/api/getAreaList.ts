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
  const populatesObject = {
    path: 'parent childs',
    select: 'name sign parent level childs',
    populate: {
      path: 'parent childs',
      select: 'name sign parent level childs',
      populate: {
        path: 'parent childs',
        select: 'name sign parent level childs',
      },
    },
  };

  const queryParams = {
    keyword: params.keyword,
    populates: JSON.stringify(populatesObject),
    ...params,
  };

  try {
    const { data: areas } = await apiClient.get<Area[]>(
      '/api/item/areas',
      queryParams,
    );

    return areas;
  } catch (error) {
    console.error('Error fetching area list:', error);

    return [];
  }
};
