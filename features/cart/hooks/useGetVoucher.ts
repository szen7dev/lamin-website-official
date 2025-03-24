'use client';

import { useQuery } from '@tanstack/react-query';

import { getVouchers } from '../api/getVouchers';
import { VoucherParams } from '../types/voucherTypes';

/**
 * Hook to fetch vouchers for a customer
 * @param params - Query parameters for the API request
 * @returns Object containing voucher data, loading state, and error if any
 */
export function useGetVoucher(params: VoucherParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vouchers', params],
    queryFn: () => getVouchers(params),
    enabled: !!params.customerID,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
