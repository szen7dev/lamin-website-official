'use client';

import { useQuery } from '@tanstack/react-query';

import { getTrustedStore } from '../../api/stores/getTrustedStore';
import { GetTrustedStoreParams } from '../../types/storeTypes';

/**
 * Hook to fetch trusted store data
 * @param params Query parameters for the API request
 * @returns Query result with trusted store data
 */
export const useGetTrustedStore = (params: GetTrustedStoreParams = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trustedStore', params],
    queryFn: () => getTrustedStore(params),
  });

  return {
    trustedStore: data || [],
    isLoading,
    error,
  };
};
