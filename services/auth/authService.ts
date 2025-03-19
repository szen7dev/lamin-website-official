// This is a mock service that simulates API calls
// Later, this can be replaced with actual API calls

import { sleep } from '@/utils/helpers';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class AuthService {
  async sendOTP(phoneNumber: string): Promise<AuthResponse> {
    // Simulate API call
    await sleep(1000);

    return {
      success: true,
      message: 'OTP sent successfully',
      data: {
        expiresIn: 290, // 4 minutes 50 seconds
      },
    };
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    // Simulate API call
    await sleep(1000);

    // For demo purposes, 111111 is valid, 000000 is invalid
    if (otp === '111111') {
      return {
        success: true,
        message: 'OTP verified successfully',
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 'user-123',
            phoneNumber,
            name: 'Demo User',
          },
        },
      };
    } else {
      return {
        success: false,
        message: `Xác thực không thành công: ${phoneNumber}, Mã OTP không đúng`,
      };
    }
  }

  async loginWithZalo(phoneNumber: string): Promise<AuthResponse> {
    // Simulate API call
    await sleep(1000);

    return {
      success: true,
      message: 'Zalo verification initiated',
    };
  }

  async loginWithSMS(phoneNumber: string): Promise<AuthResponse> {
    // Simulate API call
    await sleep(1000);

    return {
      success: true,
      message: 'SMS verification initiated',
    };
  }
}

export const authService = new AuthService();
