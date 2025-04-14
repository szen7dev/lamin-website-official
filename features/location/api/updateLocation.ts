import {
  Coach,
  UpdateContactParams,
} from '@/features/homepage/types/coachTypes';
import { apiClient } from '@/services/api/apiClient';

/**
 * Get detailed coach information by ID
 * @param params - Parameters for fetching coach details
 * @returns Promise with coach data
 */
export const updateLocation = async (
  params: UpdateContactParams,
): Promise<Coach> => {
  // Prepare query parameters
  const queryParams: Record<string, any> = {
    contactID: params.contactID,
    name: params.name,
    phone: params.phone,
    email: params.email,
    // province: params.province,
    // district: params.district,
    address: params.address,
    note: params.note,
    // areaID: params.areaID,
  };

  try {
    // Make API call to get coach details
    const coach = await apiClient.putNormalizedResponse<Coach>(
      '/api/item/contacts',
      queryParams,
    );

    return coach;
  } catch (error) {
    console.error('Error update contact coach:', error);
    throw error;
  }
};
