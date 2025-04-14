import { Order } from '../types/orderTypes';

import apiClient from '@/services/api/apiClient';
import { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches a list of orders for a specific customer
 * @param params - Parameters for fetching orders
 * @returns The list of orders
 */
export const getUserOrders = async (params: {
  customerID: string;
  keyword?: string;
  outin?: number;
  type?: number;
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
      optionSeller: DEFAULT_OPTION_SELLER,
      ...(params.outin && { outin: params.outin || 1 }),
      ...(params.type && { type: params.type || 5 }),
      ...(params.keyword && { keyword: params.keyword }),
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
