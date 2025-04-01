'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getTrustedStore } from '../../api/stores/getTrustedStore';
import { GetTrustedStoreParams } from '../../types/storeTypes';

/**
 * Custom hook to fetch trusted store data
 * @param params Query parameters for the API request
 * @returns Query result with trusted store data and a helper for getting a single store
 */
export const useGetTrustedStore = (params: GetTrustedStoreParams = {}) => {
  const {
    data: { trustedStore, response },
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['trustedStore', params],
    queryFn: () => getTrustedStore(params),
    refetchOnMount: true,
  });

  // Ensure storeData is always an array
  const storeData = Array.isArray(trustedStore)
    ? trustedStore
    : trustedStore
      ? [trustedStore]
      : [];

  // Check if we're requesting a single store by fundaID
  const isSingleStore = params.fundaID && storeData.length === 1;

  return {
    // Always return an array for trustedStore
    trustedStore: storeData,
    // Keep singleStore for convenience when querying a specific store
    singleStore: isSingleStore ? storeData[0] : null,
    isLoading,
    error,
    response, // Return the full response for metadata access
  };
};
