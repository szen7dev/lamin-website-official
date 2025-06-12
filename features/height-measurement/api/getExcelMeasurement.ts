import apiClient from '@/services/api/apiClient';
export const getExcelMeasurement = async (): Promise<string> => {
  try {
    const response = await apiClient.get('/api/crm/grow_track/export-excel');

    return response.data;
  } catch (error) {
    console.error('Error fetching excel measurement:', error);
    throw error;
  }
};
