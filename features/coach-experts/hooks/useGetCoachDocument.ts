import { useQuery } from '@tanstack/react-query';

import { getCoachDocument } from '../api/getCoachDocument';

import {
  CoachDocument,
  GetDetailCoachParams,
} from '@/features/homepage/types/coachTypes';

/**
 * Hook for fetching detailed coach information
 * @param params - Parameters for fetching coach details
 * @param enabled - Cho phép gọi hay không, MẶC ĐỊNH true (giữ hành vi cũ). Trang chi tiết truyền `false`
 *   khi hồ sơ đang xem đến từ s7 — s7 chưa có "quá trình công tác/đào tạo" (hồ sơ CV, khác hồ sơ CRM của
 *   Contact), nên KHÔNG được gửi id kiểu s7 sang API tài liệu của backend cũ để tránh nhận nhầm/lỗi dữ liệu.
 * @returns Query result with coach data, loading state, and error
 */
export const useGetCoachDocument = (
  params: GetDetailCoachParams,
  enabled = true,
) => {
  return useQuery<CoachDocument[], Error>({
    queryKey: ['GET_COACH_DOCUMENT', params.contactID, params.type],
    queryFn: () => getCoachDocument(params),
    enabled: !!params.contactID && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
