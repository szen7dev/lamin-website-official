import apiClient, { DEFAULT_OPTION_SELLER } from '../api/apiClient';

export interface Config {
  type: number;
  active: number;
  state: number;
  _id: string;
  company: string;
  userCreate: string;
  name: string;
  hotline1: string;
  hotline2: string;
  hotline3: string;
  youtube: string;
  facebook: string;
  tiktok: string;
  zalo: string;
  modifyAt: string;
  createAt: string;
  __v: number;
  address: string;
  content: string;
  email: string;
  phone: string;
  registration: string;
  userUpdate: string;
}

export interface ConfigQueryParams {
  optionSeller: number;
  isInfo?: number;
  type?: number;
}

// Hàm để lấy thông tin liên hệ (hotline, mạng xã hội, v.v.)
export async function getContactInfo(): Promise<Config> {
  try {
    const params: ConfigQueryParams = {
      optionSeller: DEFAULT_OPTION_SELLER,
      isInfo: 1,
      type: 3,
    };

    const response = await apiClient.get<Config>('/api/item/configs', params);

    return response.data;
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

// Export các hàm riêng lẻ
export const configService = {
  getContactInfo,
};

export default configService;
