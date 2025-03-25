import { Voucher, VoucherParams } from '../types/voucherTypes';

import { apiClient } from '@/services/api/apiClient';

/**
 * Fetch vouchers for a customer
 * @param customerId - ID of the customer
 * @returns Promise with voucher data
 */
export const getVouchers = async (
  params: VoucherParams,
): Promise<Voucher[]> => {
  try {
    if (!params.customerID) {
      throw new Error('Customer ID is required');
    }

    const queryParams = {
      customerID: params.customerID,
    };

    const vouchers = await apiClient.get<Voucher[]>(
      '/api/store/vouchers',
      queryParams,
    );

    console.log('Voucher res', vouchers);

    if (!vouchers) {
      throw new Error('Failed to fetch vouchers');
    }

    return vouchers || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching vouchers: ${error.message}`);
    }
    throw new Error('An error occurred while fetching vouchers');
  }
};
