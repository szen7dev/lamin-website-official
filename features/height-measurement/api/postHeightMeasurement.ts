import type {
  HeightMeasurementFormData,
  HeightMeasurementResultData,
} from '@/features/height-measurement/types/heightMeasurementTypes';

import { apiClient, DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const postHeightMeasurement = async (
  params: HeightMeasurementFormData,
): Promise<HeightMeasurementResultData> => {
  try {
    const queryParams = {
      optionSeller: params.optionSeller || DEFAULT_OPTION_SELLER,
      name: params.name,
      phone: params.phone,
      birthday:
        params.birthDate instanceof Date
          ? params.birthDate.toISOString()
          : params.birthDate,
      note: params.note || '',
      gender: params.gender,
      height: Number(params.height),
      weight: Number(params.weight),
    };

    const response = await apiClient.post('/api/crm/grow_track', queryParams);

    return response.data;
  } catch (error) {
    console.error('API: Error submitting height measurement:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Something went wrong',
    );
  }
};
