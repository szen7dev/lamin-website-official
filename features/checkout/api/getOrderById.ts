import apiClient from '@/services/api/apiClient';
import { Order } from '@/features/order/types/orderTypes';

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const populatesObject = { path: 'funda customer', select: 'name sign' };

    const queryParams = {
      populates: JSON.stringify(populatesObject),
      orderID: orderId,
    };

    const response = await apiClient.getNormalizedResponse<Order>(
      `/api/store/orders`,
      queryParams,
    );

    return response as Order;
  } catch (error) {
    console.error('Error fetching goods info:', error);
    throw error;
  }
};
