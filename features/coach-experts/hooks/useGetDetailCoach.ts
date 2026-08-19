import { useQuery } from '@tanstack/react-query';

import {
  Coach,
  GetDetailCoachParams,
} from '@/features/homepage/types/coachTypes';
import { getDetailCoach } from '@/features/coach-experts/api/getDetailCoach';

/**
 * Hook for fetching detailed coach information
 * @param params - Parameters for fetching coach details
 * @returns Query result with coach data, loading state, and error
 */
export const useGetDetailCoach = (params: GetDetailCoachParams) => {
  return useQuery<Coach, Error>({
    queryKey: ['GET_COACH_DETAIL', params.contactID],
    queryFn: () => getDetailCoach(params),
    enabled: !!params.contactID,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
