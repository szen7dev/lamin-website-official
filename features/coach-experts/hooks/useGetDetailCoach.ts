import { useQuery } from '@tanstack/react-query';

import {
  Coach,
  GetDetailCoachParams,
} from '@/features/homepage/types/coachTypes';
import { getDetailCoach } from '@/features/coach-experts/api/getDetailCoach';
import { getStoreTeamMember } from '@/features/coach-experts/api/storeTeam';

/**
 * Hook for fetching detailed coach information
 * @param params - Parameters for fetching coach details
 * @returns Query result with coach data, loading state, and error
 */
export const useGetDetailCoach = (params: GetDetailCoachParams) => {
  return useQuery<Coach, Error>({
    queryKey: ['GET_COACH_DETAIL', params.contactID],
    queryFn: async () => {
      // Gian hàng s7 TRƯỚC — `null` gồm cả hai trường hợp (chưa cấu hình gian hàng, HOẶC id này không có
      // bên s7) đều rơi về nguồn cũ như nhau, đúng cách `getStoreProductBySlug` đã làm cho sản phẩm.
      const fromStore = await getStoreTeamMember(params.contactID);

      return fromStore ?? getDetailCoach(params);
    },
    enabled: !!params.contactID,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
