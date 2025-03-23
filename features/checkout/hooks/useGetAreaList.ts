'use client';

import { useQuery } from '@tanstack/react-query';

import { getAreaList } from '../api/getAreaList';
import { Area, GetAreaListParams } from '../types/areaTypes';

/**
 * Simple React Query hook for fetching areas
 * Similar to the useGetGoodsList hook
 *
 * @param params - Query parameters for the API, like keyword
 * @returns Object containing areas, loading state, and error
 */
export const useGetAreaList = (params: GetAreaListParams = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['AREA_LIST', params],
    queryFn: () => getAreaList(params),
    enabled: true, // Always run, the API will handle empty searches
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Extract the areas from the response data
  const areas: Area[] = data || [];

  return {
    areas,
    isLoading,
    error,
    refetch,
  };
};
