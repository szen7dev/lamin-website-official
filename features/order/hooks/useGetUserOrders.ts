'use client';

import { useQuery } from '@tanstack/react-query';

import { getUserOrders } from '../api/getUserOrders';

/**
 * Hook for fetching and managing user orders
 * @param params - Parameters for fetching orders
 * @returns Object containing order list, loading state, and error
 */
export const useGetUserOrders = (params: { customerID: string }) => {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['GET_USER_ORDERS', params.customerID],
    queryFn: () => getUserOrders(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.customerID, // Only fetch if customerID is provided
  });

  return {
    orderList: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
