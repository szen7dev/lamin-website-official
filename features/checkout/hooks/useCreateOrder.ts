'use client';

import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../api/createOrder';
import { CreateOrderData, CreateOrderResponse } from '@/features/order/types/orderTypes';

/**
 * Hook for creating an order
 * @returns Mutation for creating an order
 */
export const useCreateOrder = () => {
  const mutation = useMutation<CreateOrderResponse, Error, CreateOrderData>({
    mutationFn: createOrder,
  });

  return {
    createOrder: mutation.mutate,
    ...mutation,
  };
};
