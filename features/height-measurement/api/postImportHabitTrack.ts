import apiClient from '@/services/api/apiClient';

export const postImportHabitTrack = async (dataImport: string) => {
  console.log('postImportHabitTrack', dataImport);

  try {
    const response = await apiClient.post(
      '/api/crm/grow_track/import-from-excel',
      {
        dataImport,
        optionSeller: 1,
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error importing excel measurement:', error);
    throw error;
  }
};
