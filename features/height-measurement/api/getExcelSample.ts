import apiClient from '@/services/api/apiClient';
export const getExcelSample = async (): Promise<Blob> => {
  try {
    const response = await apiClient.get('/api/crm/grow_track/export-excel', {
      responseType: 'blob',
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching excel sample:', error);
    throw error;
  }
};
