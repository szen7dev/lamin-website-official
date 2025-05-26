import { apiClient } from '@/services/api/apiClient';

export interface UserUpdateParams {
  fullname?: string;
  phone?: string;
  gender?: number;
  birthDay?: string;
  email?: string;
}

/**
 * Checks if a user exists based on phone number
 * @param params Object containing the phone number to check
 * @returns Promise with the response containing message and exists status
 */
export const updateUser = async (params: UserUpdateParams): Promise<any> => {
  try {
    // Create query parameters string
    const queryParams = new URLSearchParams();

    if (params.fullname) queryParams.append('fullname', params.fullname);
    if (params.phone) queryParams.append('phone', params.phone);
    if (params.gender) queryParams.append('gender', params.gender.toString());
    if (params.birthDay) queryParams.append('birthDay', params.birthDay);
    if (params.email) queryParams.append('email', params.email);

    // Construct the full URL with query parameters
    const url = `/api/auth/users?${queryParams.toString()}`;

    const response = await apiClient.put(url);

    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
