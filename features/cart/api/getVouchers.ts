import { Voucher, VoucherParams } from '../types/voucherTypes';

import { apiClient } from '@/services/api/apiClient';

/**
 * Fetch vouchers for a customer
 * @param params - Query parameters for the API request
 * @returns Promise with voucher data
 */
export const getVouchers = async (
  params: VoucherParams,
): Promise<Voucher[]> => {
  if (!params.customerID) {
    throw new Error('Customer ID is required');
  }

  try {
    const response = await apiClient.get<Voucher[]>(
      '/api/store/vouchers',
      params,
    );

    if (!response.data) throw new Error('Failed to fetch vouchers');

    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching vouchers: ${error?.message || error}`);
  }
};
