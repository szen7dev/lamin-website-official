import { apiClient } from '@/services/api/apiClient';
import { Contact, ContactInfoParams } from '@/features/contact/types/contact';

/**
 * Fetch contact/customer info by phone number
 * @param phone - phone of the customer
 * @returns Promise with contact data
 */
export const getContactByPhone = async (
  params: ContactInfoParams,
): Promise<Contact> => {
  try {
    if (!params.phone) {
      throw new Error('Phone number is required');
    }

    const queryParams = {
      phone: params.phone,
    };

    const response = await apiClient.get<Contact>(
      '/api/item/contacts/get-id-by-phone',
      queryParams,
    );

    if (!response.data) {
      throw new Error('Failed to fetch contact');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching contact: ${error.message}`);
    }
    throw new Error('An error occurred while fetching vouchers');
  }
};
