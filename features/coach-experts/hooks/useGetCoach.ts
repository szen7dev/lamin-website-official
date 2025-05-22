'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getCoach } from '../api/getCoach';
import { GetCoachParams } from '../../homepage/types/coachTypes';

/**
 * Hook to fetch coach/expert data
 * @param params Query parameters for the API request
 * @returns Query result with coach data
 */
export const useGetCoach = (params: GetCoachParams = {}) => {
  const {
    data: { coaches, pagination },
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['GET_COACHES', params],
    queryFn: () => getCoach(params),
  });

  return {
    coaches,
    pagination,
    isLoading,
    error,
  };
};
