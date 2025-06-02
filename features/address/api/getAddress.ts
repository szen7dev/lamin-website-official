import { Address, AddressParams } from '@/features/address/types/address';
import apiClient from '@/services/api/apiClient';

export const getAddress = async (
  params: AddressParams,
): Promise<{ data: Address[]; pagination: any }> => {
  try {
    const queryParams = {
      level: params.level || 1,
      parentID: params.parentID || '',
      lastestID: params.lastestID || '',
    };

    const { data: response, pagination } = await apiClient.get<Address[]>(
      `/api/item/areas`,
      queryParams,
    );

    return { data: response || [], pagination };
  } catch (error) {
    console.error('Error fetching address:', error);

    return { data: [], pagination: null };
  }
};
