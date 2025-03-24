import { apiClient } from '@/services/api/apiClient';

interface GetPhoneOTPParams {
  phone: string;
  optionSeller: boolean;
}

interface GetPhoneOTPResponse {
  message: string;
  error: boolean;
}

/**
 * Sends OTP to user's phone number
 * @param params Object containing the phone number and optionSeller flag
 * @returns Promise with the response containing message and error status
 */

export const getPhoneOTP = async (
  params: GetPhoneOTPParams,
): Promise<GetPhoneOTPResponse> => {
  try {
    const response = await apiClient.post<GetPhoneOTPResponse>(
      '/api/auth/users/get-phone-otp',
      {
        phone: params.phone,
        optionSeller: params.optionSeller,
      },
      false, // Don't require auth for this endpoint
    );

    return {
      message: response.message,
      error: response.error,
    };
  } catch (error) {
    console.error('Error sending OTP to phone:', error);

    // Return a standardized error response
    return {
      message: 'Không thể gửi mã OTP, hãy kiểm tra lại số điện thoại của bạn',
      error: true,
    };
  }
};
