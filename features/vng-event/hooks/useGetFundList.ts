'use client';

import { useQuery } from '@tanstack/react-query';

import { getFundList } from '@/features/vng-event/api/getFundList';
import { Fund, FundListParams } from '@/features/vng-event/types/fund';

export const useGetFundList = (params: FundListParams) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_FUND_LIST', params.type, params.eventID],
    queryFn: () => getFundList(params),
    staleTime: 1000 * 60 * 5,
  });

  return {
    fundList: data as Fund[],
    isLoading,
    error,
    refetch,
    hasData: !!data,
  };
};
