'use client';

import type { GrowTrackApiResponse } from '@/features/height-measurement/types/heightMeasurementTypes';

import { useQuery } from '@tanstack/react-query';

import { getHeightMeasurementInfo } from '../api/getHeightMeasurementInfo';

/**
 * Hook để lấy thông tin đo chiều cao từ server
 * @param trackId - ID của bản ghi đo chiều cao
 * @returns Object chứa dữ liệu đo chiều cao, trạng thái loading và lỗi nếu có
 */
export function useGetHeightMeasurementInfo(trackId?: string) {
  const { data, isLoading, error, refetch } = useQuery<
    GrowTrackApiResponse,
    Error
  >({
    queryKey: ['heightMeasurement', trackId],
    queryFn: async () => {
      if (!trackId) {
        throw new Error('Track ID không được cung cấp');
      }

      return getHeightMeasurementInfo(trackId);
    },
    enabled: !!trackId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
