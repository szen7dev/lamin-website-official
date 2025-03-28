// This is a mock service that simulates API calls
// Later, this can be replaced with actual API calls

import { login as loginApi } from '@/features/auth/api/login';
import { getPhoneOTP } from '@/features/auth/api/getPhoneOTP';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class AuthService {
  async sendOTP(phoneNumber: string): Promise<AuthResponse> {
    try {
      // Use the real API endpoint
      await getPhoneOTP({
        phone: phoneNumber,
        optionSeller: false,
      });

      return {
        success: true,
        message: 'OTP sent successfully',
        data: {
          expiresIn: 290, // 4 minutes 50 seconds
        },
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send OTP. Please try again.',
      };
    }
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    try {
      // Use the real login API endpoint with phone/OTP
      const response = await loginApi({
        email: phoneNumber, // Use phone number as email
        password: otp, // Use OTP as password
      });

      if (response.success) {
        return {
          success: true,
          message: 'OTP verified successfully',
          data: {
            token: response.token,
            user: response.user,
          },
        };
      } else {
        return {
          success: false,
          message:
            response.message || 'Xác thực không thành công. Mã OTP không đúng',
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Verification failed. Please try again.',
      };
    }
  }
}

export const authService = new AuthService();
