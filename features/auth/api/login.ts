import { apiClient } from '@/services/api/apiClient';

export interface LoginParams {
  // phone number
  email: string;
  // OTP
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    birthDay?: string | null;
    bizfullname?: string;
    company?: {
      name?: string;
      phone?: string;
      sign?: string;
      _id?: string;
    };
    contacts?: Array<{
      balance?: number;
      company?: string;
      email?: string;
      image?: string;
      name?: string;
      phone?: string;
      remainLoyaltyPoints?: number;
      _id?: string;
    }>;
    fullname?: string;
    gender?: 1 | 2 | 3;
    image?: string;
    lang?: string;
    level?: number;
    signature?: string;
    status?: number;
  };
  error?: boolean;
}

/**
 * Login using email/password or phone/OTP
 * @param params Object containing either email/password or phone/OTP
 * @returns Promise with login response containing token and user data
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/users/login',
      {
        email: params.email, // This can be either email or phone number
        password: params.password, // This can be either password or OTP
      },
    );

    // If API returns standardized response
    if (response.data && typeof response.data === 'object') {
      return {
        success: !response.data.error,
        message: response.data.message,
        token: response.data.token,
        user: response.data.user,
      };
    }

    // If API doesn't return expected format, standardize it
    return {
      success: false,
      message: 'Định dạng phản hồi không hợp lệ',
    };
  } catch (error) {
    console.error('Error during login:', error);

    // Return a standardized error response
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập và thử lại.',
    };
  }
};
