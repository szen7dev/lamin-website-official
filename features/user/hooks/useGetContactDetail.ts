'use client';

import { useQuery } from '@tanstack/react-query';

import { GetContactParams } from '@/features/user/types/userTypes';
import { getContact } from '@/features/user/api/getContact';
import { Contact } from '@/features/user/types/userTypes';

export function useGetContactDetail(params: GetContactParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_USER_CONTACT', params.contactID],
    queryFn: () => getContact({ params }),
    enabled: !!params.contactID,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  return {
    contactDetail: data as Contact,
    isLoading,
    error,
    refetch,
  };
}
