import { Fund, FundUpsertParams } from '@/features/vng-event/types/fund';
import apiClient from '@/services/api/apiClient';

export const createFund = async (params: FundUpsertParams): Promise<Fund> => {
  try {
    const queryParams = {
      ...params,
    };

    const response = await apiClient.post<Fund>(
      `/api/crm/vng_fund`,
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error creating fund:', error);
    throw error;
  }
};
