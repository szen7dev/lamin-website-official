import { useQuery } from '@tanstack/react-query';

import { getCoachDocument } from '../api/getCoachDocument';

import {
  CoachDocument,
  GetDetailCoachParams,
} from '@/features/homepage/types/coachTypes';

/**
 * Hook for fetching detailed coach information
 * @param params - Parameters for fetching coach details
 * @returns Query result with coach data, loading state, and error
 */
export const useGetCoachDocument = (params: GetDetailCoachParams) => {
  return useQuery<CoachDocument[], Error>({
    queryKey: ['GET_COACH_DOCUMENT', params.contactID],
    queryFn: () => getCoachDocument(params),
    enabled: !!params.contactID,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
