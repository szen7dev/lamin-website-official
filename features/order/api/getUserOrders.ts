import { Order } from '../types/orderTypes';

import apiClient from '@/services/api/apiClient';

/**
 * Fetches a list of questions for a specific product
 * @param params - Parameters for fetching questions
 * @returns The list of orders
 */
export const getUserOrders = async (params: {
  customerID: string;
}): Promise<Order[]> => {
  try {
    const queryParams = {
      customerID: params.customerID,
      populates: JSON.stringify({
        path: 'products',
        select:
          'name sign price quantity unitPrice listedUnitprice unit thumbnail',
      }),
      select: 'name date userCreate amount type outin customer status',
    };

    const response = await apiClient.getNormalizedResponse<Order[]>(
      '/api/store/orders',
      queryParams,
    );

    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
