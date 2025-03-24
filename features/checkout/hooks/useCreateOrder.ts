'use client';

import { useMutation } from '@tanstack/react-query';

import { createOrder, type CreateOrderData } from '../api/createOrder';

/**
 * Hook for creating an order
 * @returns Mutation for creating an order
 */
export const useCreateOrder = () => {
  const { mutate, isPending, isError, error, isSuccess, data } = useMutation({
    mutationFn: (orderData: CreateOrderData) => createOrder(orderData),
    onSuccess: data => {
      console.log('Order created successfully:', data);
    },
    onError: error => {
      console.error('Failed to create order:', error);
    },
  });

  return {
    createOrder: mutate,
    isCreating: isPending,
    isError,
    error,
    isSuccess,
    orderData: data,
  };
};
