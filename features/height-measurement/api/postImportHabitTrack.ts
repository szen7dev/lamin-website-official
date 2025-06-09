import { HabitTrackFormData } from '../types/heightMeasurementTypes';

import apiClient from '@/services/api/apiClient';

export const postImportHabitTrack = async (formData: HabitTrackFormData) => {
  try {
    const response = await apiClient.post(
      '/api/crm/habit_track/import-from-excel',
      formData,
    );

    return response.data;
  } catch (error) {
    console.error('Error importing excel measurement:', error);
    throw error;
  }
};
