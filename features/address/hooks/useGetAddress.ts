'use client';

import { useQuery } from '@tanstack/react-query';

import { getAddress } from '@/features/address/api/getAddress';
import { AddressParams } from '@/features/address/types/address';

export const useGetAddress = (params: AddressParams) => {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['GET_ADDRESS', params.type, params.parentID],
    queryFn: () => getAddress(params),
    staleTime: 1000 * 60 * 5,
    enabled: !!params.type,
  });

  return {
    addressList: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
