import { ActivateProductParams } from '@/features/activate-product/types/activate';
import apiClient from '@/services/api/apiClient';

export const postActivateProduct = async (
  params: ActivateProductParams,
): Promise<any> => {
  try {
    const queryParams = {
      ...params,
    };
    const response = await apiClient.post(`/api/store/items`, queryParams);

    if (!response.data) {
      throw new Error('No data returned from API');
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
