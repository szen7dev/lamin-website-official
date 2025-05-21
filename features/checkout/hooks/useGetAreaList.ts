'use client';

import { useQuery } from '@tanstack/react-query';

import { getAreaList } from '../api/getAreaList';
import { GetAreaListParams } from '../types/areaTypes';

/**
 * Simple React Query hook for fetching areas
 * @param params - Query parameters for the API, like keyword
 * @returns Object containing areas, loading state, and error
 */
export const useGetAreaList = (params: GetAreaListParams = {}) => {
  const query = useQuery({
    queryKey: ['AREA_LIST', params],
    queryFn: () => getAreaList(params),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  return {
    areas: query.data || [],
    ...query,
  };
};
