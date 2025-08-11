'use client';

import { useQuery } from '@tanstack/react-query';

import { GetContactParams } from '@/features/user/types/userTypes';
import { getContact } from '@/features/user/api/getContact';
import { Contact } from '@/features/user/types/userTypes';

export function useGetContact({ enabled = true, ...params }: GetContactParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_USER_CONTACT', ...Object.values(params)],
    queryFn: () => getContact({ params }),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: !!enabled,
  });

  return {
    contactList: data as Contact[],
    contactDetail: data as Contact,
    isLoading,
    error,
    refetch,
  };
}
