import {
  HeightHistory,
  HeightHistoryParams,
} from '@/features/height-measurement/types/heightMeasurementTypes';
import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

/**
 * Fetches a list of questions for a specific product
 * @param params - Parameters for fetching questions
 * @returns The list of questions
 */
export const getHeightHistory = async (
  params: HeightHistoryParams,
): Promise<HeightHistory[]> => {
  try {
    const queryParams = {
      optionSeller: DEFAULT_OPTION_SELLER,
      select:
        'date name parentName gender birthday height weight desiredHeight phone note percentile',
      ...(params.limit ? { limit: params.limit } : {}),
      ...(params.phone ? { phone: params.phone } : {}),
      ...(params.contactID ? { contactID: params.contactID } : {}),
    };

    const response = await apiClient.get<HeightHistory[]>(
      '/api/crm/grow_track',
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching question list:', error);
    throw error;
  }
};
