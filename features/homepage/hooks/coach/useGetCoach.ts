'use client';

import { useQuery } from '@tanstack/react-query';

import { getCoach } from '../../api/coach/getCoach';
import { GetCoachParams } from '../../types/coachTypes';

/**
 * Hook to fetch coach/expert data
 * @param params Query parameters for the API request
 * @returns Query result with coach data
 */
export const useGetCoach = (params: GetCoachParams = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['coaches', params],
    queryFn: () => getCoach(params),
  });

  return {
    coaches: data || [],
    isLoading,
    error,
  };
};
