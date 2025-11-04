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
      parentName: params.parentName || '',
      fatherHeight: Number(params.fatherHeight) || 0,
      motherHeight: Number(params.motherHeight) || 0,
      email: params.email || '',
      desiredHeight: Number(params.desiredHeight) || 0,
      routine: params.routine || '',
      date: params.date || '',
      name: params.name || '',
      phone: params.phone || '',
      birthday:
        params.birthDate instanceof Date
          ? params.birthDate.toISOString()
          : params.birthDate,
      note: params.note || '',
      gender: params.gender,
      height: Number(params.height) || 0,
      weight: Number(params.weight) || 0,
      boneAge: params.boneAge ? Number(params.boneAge) : undefined,
      pubertyOnsetDate: params.pubertyOnsetDate
        ? params.pubertyOnsetDate instanceof Date
          ? params.pubertyOnsetDate.toISOString()
          : params.pubertyOnsetDate
        : undefined,
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
