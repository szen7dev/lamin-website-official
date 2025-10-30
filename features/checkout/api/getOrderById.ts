import apiClient from '@/services/api/apiClient';
import { Order } from '@/features/order/types/orderTypes';

export const getOrderById = async (orderId: string): Promise<Order> => {
  const populatesObject = { path: 'funda customer', select: 'name sign' };
  const queryParams = {
    populates: JSON.stringify(populatesObject),
    orderID: orderId,
  };
  const { data: order } = await apiClient.get<Order>(
    '/api/store/orders',
    queryParams,
  );

  return order;
};
