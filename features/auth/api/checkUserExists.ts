import { apiClient } from '@/services/api/apiClient';

interface CheckUserExistsParams {
  phone: string;
}

interface CheckUserExistsResponse {
  message: string;
  exists: boolean;
}

/**
 * Checks if a user exists based on phone number
 * @param params Object containing the phone number to check
 * @returns Promise with the response containing message and exists status
 */
export const checkUserExists = async (
  params: CheckUserExistsParams,
): Promise<CheckUserExistsResponse> => {
  try {
    const response = await apiClient.post<{ message: string }>(
      '/api/auth/users/check-user-exists',
      { phone: params.phone },
      false, // Don't require auth for this endpoint
    );

    // Determine if user exists based on the message
    const exists = response.message !== 'Tài khoản chưa tồn tại';

    return {
      message: response.message,
      exists,
    };
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
};
