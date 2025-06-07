'use client';

import { useQuery } from '@tanstack/react-query';

import { getHeightHistory } from '../api/getHeightHistory';
import {
  HeightHistoryParams,
  HeightHistory,
} from '../types/heightMeasurementTypes';

export function useGetHeightHistory(params: HeightHistoryParams) {
  return useQuery<HeightHistory[]>({
    queryKey: ['GET_HEIGHT_HISTORY'],
    queryFn: () => getHeightHistory(params),
    enabled: !!params.phone || !!params.contactID,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
