'use client';

import { useQuery } from '@tanstack/react-query';

import { getHeightHistory } from '../api/getHeightHistory';
import {
  HeightHistoryParams,
  HeightHistory,
} from '../types/heightMeasurementTypes';

export function useGetHeightHistory(params: HeightHistoryParams) {
  return useQuery<HeightHistory[]>({
    queryKey: ['GET_HEIGHT_HISTORY', params.phone],
    queryFn: () => getHeightHistory(params),
    enabled: !!params.phone,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
