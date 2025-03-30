import apiClient from '@/services/api/apiClient';
import {
  CreateOrderData,
  CreateOrderResponse,
} from '@/features/order/types/orderTypes';

/**
 * Creates a new order
 * @param data - Order data to be submitted
 * @returns The created order data from the API response
 */
export const createOrder = async (data: CreateOrderData) => {
  try {
    const response: CreateOrderResponse =
      await apiClient.postNormalizedResponse<CreateOrderResponse>(
        '/api/store/orders/insert-full',
        data,
      );

    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
