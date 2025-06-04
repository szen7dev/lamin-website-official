import { Contact, GetContactParams } from '../types/userTypes';

import { apiClient } from '@/services/api/apiClient';

export async function getContact({
  params,
}: {
  params: GetContactParams;
}): Promise<Contact[]> {
  try {
    const queryParams = {
      userCreateID: params.userCreateID,
    };
    const response = await apiClient.get<Contact[]>(
      '/api/item/contacts',
      queryParams,
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
}
