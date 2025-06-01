import { Fund, FundListParams } from '@/features/vng-event/types/fund';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getFundList = async (
  params: FundListParams,
): Promise<Fund[] | Fund> => {
  try {
    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      populates: params.populates
        ? JSON.stringify(params.populates)
        : JSON.stringify({ path: 'event', select: 'name' }),
      ...params,
    };

    const response = await apiClient.get<Fund[] | Fund>(
      `/api/crm/vng_fund`,
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching event list:', error);
    throw error;
  }
};
