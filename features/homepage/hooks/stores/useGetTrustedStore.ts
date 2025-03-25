'use client';

import { useQuery } from '@tanstack/react-query';

import { getTrustedStore } from '../../api/stores/getTrustedStore';
import { GetTrustedStoreParams, TrustedStore } from '../../types/storeTypes';

/**
 * Hook to fetch trusted store data
 * @param params Query parameters for the API request
 * @returns Query result with trusted store data and a helper for getting a single store
 */
export const useGetTrustedStore = (params: GetTrustedStoreParams = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trustedStore', params],
    queryFn: () => getTrustedStore(params),
  });

  // Handle both array and object responses
  const storeData = data || [];

  // If fundaID is provided, we expect a single store object
  // If not, we expect an array of stores
  const isSingleStore = !Array.isArray(storeData) && !!storeData;

  return {
    trustedStore: isSingleStore
      ? storeData
      : Array.isArray(storeData)
        ? storeData
        : [],
    singleStore: isSingleStore ? (storeData as TrustedStore) : null,
    isLoading,
    error,
  };
};
