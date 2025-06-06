import { UpdateContactParams } from '../types/userTypes';

import { apiClient } from '@/services/api/apiClient';

export async function updateContact(params: UpdateContactParams): Promise<any> {
  try {
    const queryParams = {
      ...params,
    };
    const response = await apiClient.put('/api/item/contacts', queryParams);

    return response.data;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}
