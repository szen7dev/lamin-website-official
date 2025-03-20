import apiClient, { DEFAULT_OPTION_SELLER } from '../api/apiClient';

export interface Config {
  _id: string;
  name: string;
  value: any;
  type: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  // Add the specific fields from the API response
  hotline1?: string;
  hotline2?: string;
  hotline3?: string;
  youtube?: string;
  facebook?: string;
  zalo?: string;
  address?: string;
  content?: string;
  email?: string;
  phone?: string;
  registration?: string;
  company?: string;
}

export interface ConfigQueryParams {
  optionSeller: number;
  isInfo?: number;
  type?: number;
}

export interface ApiResponse<T> {
  error: boolean;
  data: T;
  status: number;
}

// Hàm để lấy thông tin liên hệ (hotline, mạng xã hội, v.v.)
export async function getContactInfo(): Promise<Config[]> {
  try {
    const params: ConfigQueryParams = {
      optionSeller: DEFAULT_OPTION_SELLER,
      isInfo: 1,
      type: 3,
    };

    const response = await apiClient.get<ApiResponse<Config | Config[]>>(
      '/api/item/configs',
      params,
    );

    // Xử lý cả trường hợp response.data là object hoặc array
    if (!response || !response.data) return [];

    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error: any) {
    console.error('Error fetching contact info:', error);
    // Thêm thông tin chi tiết vào error
    error.context = {
      service: 'configService',
      method: 'getContactInfo',
      params: { optionSeller: DEFAULT_OPTION_SELLER, isInfo: 1, type: 3 },
    };
    throw error;
  }
}

// Hàm để lấy cấu hình trang web theo loại
export async function getConfigByType(type: number): Promise<Config[]> {
  try {
    const params: ConfigQueryParams = {
      optionSeller: DEFAULT_OPTION_SELLER,
      type,
    };

    const response = await apiClient.get<ApiResponse<Config | Config[]>>(
      '/api/item/configs',
      params,
    );

    // Xử lý nhất quán giống getContactInfo
    if (!response || !response.data) return [];

    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error: any) {
    console.error('Error fetching config by type:', error);
    error.context = {
      service: 'configService',
      method: 'getConfigByType',
      params: { optionSeller: DEFAULT_OPTION_SELLER, type },
    };
    throw error;
  }
}

// Export các hàm riêng lẻ
export const configService = {
  getContactInfo,
  getConfigByType,
};

export default configService;
