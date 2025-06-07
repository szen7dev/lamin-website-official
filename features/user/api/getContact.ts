import { Contact, GetContactParams } from '../types/userTypes';

import { apiClient } from '@/services/api/apiClient';

export async function getContact({
  params,
}: {
  params: GetContactParams;
}): Promise<Contact | Contact[]> {
  try {
    const queryParams = {
      userCreateID: params.userCreateID || '',
      parentID: params.parentID || '',
      contactID: params.contactID || '',
    };
    const response = await apiClient.get<Contact | Contact[]>(
      '/api/item/contacts',
      queryParams,
    );

    console.log('queryParams', queryParams);

    return response.data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
}
