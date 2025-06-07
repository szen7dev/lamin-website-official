'use client';

import { useQuery } from '@tanstack/react-query';

import { GetContactParams } from '@/features/user/types/userTypes';
import { getContact } from '@/features/user/api/getContact';
import { Contact } from '@/features/user/types/userTypes';

export function useGetContact(params: GetContactParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_USER_CONTACT'],
    queryFn: () => getContact({ params }),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  return {
    contactList: data as Contact[],
    contactDetail: data as Contact,
    isLoading,
    error,
    refetch,
  };
}
