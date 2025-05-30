'use client';

import { useQuery } from '@tanstack/react-query';

import { getDoctype } from '@/features/doctype/api/getDoctype';
import { DoctypeParams } from '@/features/doctype/types/doctype';

export const useGetDoctype = (params: DoctypeParams) => {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['DOCTYPE', params.type],
    queryFn: () => getDoctype(params),
    staleTime: 1000 * 60 * 5,
    enabled: !!params.type,
  });

  return {
    doctypeList: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
