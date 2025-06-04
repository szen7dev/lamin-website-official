'use client';

import { useQuery } from '@tanstack/react-query';

import { GetContactParams } from '@/features/user/types/userTypes';
import { getContact } from '@/features/user/api/getContact';

export function useGetContact(params: GetContactParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_USER_CONTACT', params],
    queryFn: () => getContact({ params }),
    enabled: !!params.userCreateID,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  return {
    contactList: data,
    isLoading,
    error,
    refetch,
  };
}
