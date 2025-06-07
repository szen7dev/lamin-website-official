import { CreateContactParams } from '../types/userTypes';

import { apiClient } from '@/services/api/apiClient';

export async function createContact(params: CreateContactParams): Promise<any> {
  try {
    const queryParams = {
      parent: params.parent || '',
      ...params,
    };
    const response = await apiClient.post('/api/item/contacts', queryParams);

    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}
