'use client';

import { useQuery } from '@tanstack/react-query';

import { ContactInfoParams } from '@/features/contact/types/contact';
import { getContactByPhone } from '@/features/contact/api/getContactByPhone';

/**
 * Hook to fetch vouchers for a customer
 * @param params - Query parameters for the API request
 * @returns Object containing voucher data, loading state, and error if any
 */
export function useGetContactByPhone(params: ContactInfoParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_CONTACT_BY_PHONE', params],
    queryFn: () => getContactByPhone(params),
    enabled: !!params.phone,
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
