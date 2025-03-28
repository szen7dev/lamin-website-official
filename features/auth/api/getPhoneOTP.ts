import { apiClient } from '@/services/api/apiClient';

interface GetPhoneOTPParams {
  phone: string;
  optionSeller: boolean;
}

/**
 * Sends OTP to user's phone number
 * @param params Object containing the phone number and optionSeller flag
 * @returns Promise with the OTP string
 */

export const getPhoneOTP = async (
  params: GetPhoneOTPParams,
): Promise<string> => {
  try {
    const response = await apiClient.postNormalizedResponse<string>(
      '/api/auth/users/get-phone-otp',
      {
        phone: params.phone,
        optionSeller: params.optionSeller || 1,
      },
      false, // Don't require auth for this endpoint
    );

    return response;
  } catch (error) {
    console.error('Error sending OTP to phone:', error);

    // Return a standardized error response
    throw new Error(
      'Không thể gửi mã OTP, hãy kiểm tra lại số điện thoại của bạn',
    );
  }
};
