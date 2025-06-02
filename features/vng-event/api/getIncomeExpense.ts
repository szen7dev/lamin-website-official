import apiClient, { DEFAULT_OPTION_SELLER } from '@/services/api/apiClient';

export const getIncomeExpense = async (): Promise<{ data: any[] }> => {
  try {
    const queryParams = {
      optionSeller: DEFAULT_OPTION_SELLER,
    };

    const response = await apiClient.get<any[]>(
      `/api/crm/vng_event/get-list-by-property`,
      queryParams,
    );

    return response;
  } catch (error) {
    console.error('Error fetching event list:', error);
    throw error;
  }
};
