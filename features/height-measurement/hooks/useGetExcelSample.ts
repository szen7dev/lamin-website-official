'use client';

import { useQuery } from '@tanstack/react-query';

import { getExcelSample } from '../api/getExcelSample';

export function useGetExcelSample() {
  return useQuery({
    queryKey: ['GET_EXCEL_SAMPLE'],
    queryFn: getExcelSample,
    enabled: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
