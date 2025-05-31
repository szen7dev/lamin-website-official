import { Address, AddressParams } from '@/features/address/types/address';
import apiClient from '@/services/api/apiClient';

export const getAddress = async (params: AddressParams): Promise<Address[]> => {
  try {
    const queryParams = {
      type: params.type || 1,
      parentID: params.parentID || '',
    };

    const response = await apiClient.get<Address[]>(
      `/api/item/areas`,
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching address:', error);

    return [];
  }
};
