'use client';

import { useQuery } from '@tanstack/react-query';

import { getOrderById } from '@/features/checkout/api/getOrderById';
import { Order } from '@/features/order/types/orderTypes';

/**
 * Hook for fetching detailed order info by ID
 * @param orderId - ID of the order to fetch
 * @returns Object containing order info, loading state, and error
 */
export const useGetOrderById = (orderId: string) => {
  const query = useQuery({
    queryKey: ['GET_ORDER', orderId],
    queryFn: () => getOrderById(orderId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!orderId, // Only fetch if orderId is provided
  });

  return {
    order: query.data as Order,
    ...query,
  };
};
